#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Deploy blue-green (sem proxy) do DevFlow.
#
# Ideia: cada deploy sobe a versao nova como uma "cor" (blue/green) alternada,
# PRIMEIRO numa porta temporaria (so localhost). A versao ativa continua
# atendendo nas portas publicas o tempo todo. So depois da candidata passar no
# health check e que fazemos o cutover (rebind para as portas reais).
#
#   - Candidata quebrou?  -> a versao ativa NUNCA e tocada. Prod nao cai.
#   - Candidata ok?       -> cutover (poucos segundos de downtime no rebind).
#   - Deu ruim no cutover? -> rollback automatico para a versao anterior.
#
# A cor anterior fica PARADA (nao removida) para rollback instantaneo via
# scripts/rollback.sh.
# =============================================================================

DEPLOY_PATH="${DEPLOY_PATH:-/opt/devflow}"
REPO_URL="${REPO_URL:-https://github.com/rodrigolessa1980/sistema-de-projetos-interno.git}"
BRANCH="${BRANCH:-main}"

# Estado da cor ativa fica FORA do working tree do git: o deploy roda
# `git reset --hard` + `git clean -fd`, que apagaria qualquer arquivo dentro
# de ${DEPLOY_PATH}.
STATE_DIR="${STATE_DIR:-$(dirname "${DEPLOY_PATH}")/devflow-state}"
ACTIVE_COLOR_FILE="${STATE_DIR}/active_color"

# Portas publicas (reais) e portas temporarias de validacao (apenas localhost).
REAL_BACKEND_PORT="${REAL_BACKEND_PORT:-4011}"
REAL_FRONTEND_PORT="${REAL_FRONTEND_PORT:-8022}"
TMP_BACKEND_PORT="${TMP_BACKEND_PORT:-4012}"
TMP_FRONTEND_PORT="${TMP_FRONTEND_PORT:-8023}"

if [[ -z "${ENV_BACKEND:-}" || -z "${ENV_FRONTEND:-}" ]]; then
  echo "Erro: ENV_BACKEND e ENV_FRONTEND devem estar definidos."
  exit 1
fi

if ! printf '%s\n' "${ENV_FRONTEND}" | grep -q '^NEXT_PUBLIC_API_URL='; then
  echo "Erro: ENV_FRONTEND deve conter NEXT_PUBLIC_API_URL (mesmo padrao do .env.local)."
  exit 1
fi

# Nunca deixar o git abrir prompt interativo (sem TTY isso quebra o deploy com
# "could not read Username for 'https://github.com'").
export GIT_TERMINAL_PROMPT=0

# Autenticacao opcional: quando GH_TOKEN esta presente, injeta o cabecalho de
# autorizacao apenas para o comando (nao persiste o token no .git/config).
GIT_AUTH=()
if [[ -n "${GH_TOKEN:-}" ]]; then
  BASIC_AUTH="$(printf 'x-access-token:%s' "${GH_TOKEN}" | base64 | tr -d '\n')"
  GIT_AUTH=(-c "http.https://github.com/.extraheader=AUTHORIZATION: basic ${BASIC_AUTH}")
fi

if [[ ! -d "${DEPLOY_PATH}/.git" ]]; then
  echo "Primeiro deploy: clonando repositorio em ${DEPLOY_PATH}..."
  mkdir -p "$(dirname "${DEPLOY_PATH}")"
  git ${GIT_AUTH[@]+"${GIT_AUTH[@]}"} clone --branch "${BRANCH}" --single-branch "${REPO_URL}" "${DEPLOY_PATH}"
  cd "${DEPLOY_PATH}"
else
  echo "Atualizando repositorio em ${DEPLOY_PATH}..."
  cd "${DEPLOY_PATH}"
  # Normaliza a origin para a URL canonica (auto-corrige remote invalido no servidor).
  git remote set-url origin "${REPO_URL}" 2>/dev/null || git remote add origin "${REPO_URL}"
  git ${GIT_AUTH[@]+"${GIT_AUTH[@]}"} fetch origin "${BRANCH}"
  git reset --hard "origin/${BRANCH}"
  git clean -fd
fi

cd "${DEPLOY_PATH}"

printf '%s\n' "${ENV_BACKEND}" > backend/.env
printf '%s\n' "${ENV_FRONTEND}" > .env.production
chmod 600 backend/.env .env.production

echo "Commit deployado: $(git rev-parse --short HEAD) - $(git log -1 --pretty=%s)"
echo "NEXT_PUBLIC_API_URL: $(grep '^NEXT_PUBLIC_API_URL=' .env.production || true)"

set -a
# shellcheck disable=SC1091
source .env.production
set +a

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

mkdir -p "${STATE_DIR}"

# Base do comando compose. O nome do projeto (-p devflow_<cor>) e as variaveis
# COLOR / BACKEND_BIND / FRONTEND_BIND sao adicionados por invocacao, pois mudam
# entre validacao (porta temp) e cutover (porta real) e entre as cores.
COMPOSE_BASE=(docker compose
  --env-file .env.production
  --env-file backend/.env
  -f docker-compose.prod.yml
)

# --- helpers -----------------------------------------------------------------

# Espera o backend responder 200 em /api/health. Aborta cedo se detectar crash.
wait_backend_healthy() {
  local port="$1" container="$2" attempt logs
  for attempt in $(seq 1 36); do
    if curl -sf --max-time 5 "http://127.0.0.1:${port}/api/health" >/dev/null; then
      echo "Backend saudavel (${container} em :${port}) na tentativa ${attempt}."
      return 0
    fi

    echo "Tentativa ${attempt}/36: backend (${container} em :${port}) ainda indisponivel..."
    logs="$(docker logs "${container}" --tail 40 2>&1 || true)"
    echo "${logs}"

    if echo "${logs}" | grep -qE 'MODULE_NOT_FOUND|Cannot find module|Falha ao iniciar a API|Error:'; then
      echo "ERRO: backend (${container}) falhou ao iniciar (nao adianta aguardar)."
      docker logs "${container}" --tail 200 2>&1 || true
      return 1
    fi

    sleep 5
  done

  echo "ERRO: backend (${container}) nao respondeu apos 3 minutos."
  docker logs "${container}" --tail 200 2>&1 || true
  return 1
}

# Espera o frontend aceitar conexao HTTP (qualquer status = servidor de pe).
wait_frontend_healthy() {
  local port="$1" container="$2" attempt
  for attempt in $(seq 1 24); do
    if curl -s --max-time 5 -o /dev/null "http://127.0.0.1:${port}/"; then
      echo "Frontend saudavel (${container} em :${port}) na tentativa ${attempt}."
      return 0
    fi
    echo "Tentativa ${attempt}/24: frontend (${container} em :${port}) ainda indisponivel..."
    sleep 5
  done

  echo "ERRO: frontend (${container}) nao respondeu."
  docker logs "${container}" --tail 200 2>&1 || true
  return 1
}

# Rollback do cutover: derruba a candidata e devolve as portas publicas a versao
# anterior (cor ativa ou containers legados do modelo antigo).
restore_previous() {
  echo "== ROLLBACK: devolvendo as portas publicas a versao anterior =="
  COLOR="${IDLE_COLOR}" "${COMPOSE_BASE[@]}" -p "devflow_${IDLE_COLOR}" stop 2>/dev/null || true

  if [[ -n "${ACTIVE_COLOR}" ]]; then
    echo "Reativando cor anterior (${ACTIVE_COLOR}) nas portas reais..."
    # A cor anterior foi apenas parada (mantem o bind das portas reais): start basta.
    if ! COLOR="${ACTIVE_COLOR}" "${COMPOSE_BASE[@]}" -p "devflow_${ACTIVE_COLOR}" start 2>/dev/null; then
      COLOR="${ACTIVE_COLOR}" BACKEND_BIND="${REAL_BACKEND_PORT}" FRONTEND_BIND="${REAL_FRONTEND_PORT}" \
        "${COMPOSE_BASE[@]}" -p "devflow_${ACTIVE_COLOR}" up -d --force-recreate 2>/dev/null || true
    fi
  else
    echo "Reativando containers legados (devflow_backend / devflow_frontend)..."
    docker start devflow_backend devflow_frontend 2>/dev/null || true
  fi
}

# --- determina cor ativa e cor candidata -------------------------------------

ACTIVE_COLOR="$(cat "${ACTIVE_COLOR_FILE}" 2>/dev/null || true)"
case "${ACTIVE_COLOR}" in
  blue)  IDLE_COLOR="green" ;;
  green) IDLE_COLOR="blue" ;;
  *)
    # Primeira execucao no modelo blue-green: os containers legados
    # (devflow_backend / devflow_frontend, sem sufixo) ainda podem estar
    # servindo. Subimos "blue" como primeira cor.
    ACTIVE_COLOR=""
    IDLE_COLOR="blue"
    echo "Nenhuma cor ativa registrada. Primeiro deploy blue-green -> candidata 'blue'."
    ;;
esac

BACKEND_CANDIDATE="devflow_backend_${IDLE_COLOR}"
FRONTEND_CANDIDATE="devflow_frontend_${IDLE_COLOR}"

echo "============================================================"
echo " Cor ativa atual:   ${ACTIVE_COLOR:-<legado>}"
echo " Cor candidata:     ${IDLE_COLOR}"
echo " Portas publicas:   backend :${REAL_BACKEND_PORT} | frontend :${REAL_FRONTEND_PORT}"
echo " Portas de teste:   backend 127.0.0.1:${TMP_BACKEND_PORT} | frontend 127.0.0.1:${TMP_FRONTEND_PORT}"
echo "============================================================"

echo "Espaco em disco antes da limpeza:"
df -h || true
echo "Limpando apenas containers parados antes do build..."
docker container prune -f || true

# --- [1/4] build da candidata ------------------------------------------------

echo "== [1/4] Build da cor candidata (${IDLE_COLOR}) =="
if ! COLOR="${IDLE_COLOR}" timeout 35m "${COMPOSE_BASE[@]}" -p "devflow_${IDLE_COLOR}" build; then
  echo "ERRO: build da candidata ${IDLE_COLOR} falhou. Producao intacta."
  exit 1
fi

# --- [2/4] sobe a candidata em portas temporarias (nao expoe publicamente) ---

echo "== [2/4] Subindo candidata (${IDLE_COLOR}) em portas temporarias =="
if ! COLOR="${IDLE_COLOR}" \
     BACKEND_BIND="127.0.0.1:${TMP_BACKEND_PORT}" \
     FRONTEND_BIND="127.0.0.1:${TMP_FRONTEND_PORT}" \
     timeout 10m "${COMPOSE_BASE[@]}" -p "devflow_${IDLE_COLOR}" up -d --force-recreate --remove-orphans; then
  echo "ERRO: falha ao subir a candidata ${IDLE_COLOR}. Producao intacta."
  docker logs "${BACKEND_CANDIDATE}" --tail 200 2>&1 || true
  COLOR="${IDLE_COLOR}" "${COMPOSE_BASE[@]}" -p "devflow_${IDLE_COLOR}" down --remove-orphans 2>/dev/null || true
  exit 1
fi

# --- [3/4] valida a candidata antes de tocar em qualquer coisa da prod --------

echo "== [3/4] Validando candidata (${IDLE_COLOR}) =="
if ! wait_backend_healthy "${TMP_BACKEND_PORT}" "${BACKEND_CANDIDATE}" \
   || ! wait_frontend_healthy "${TMP_FRONTEND_PORT}" "${FRONTEND_CANDIDATE}"; then
  echo "ERRO: candidata ${IDLE_COLOR} nao passou na validacao. Producao intacta (nada foi trocado)."
  COLOR="${IDLE_COLOR}" "${COMPOSE_BASE[@]}" -p "devflow_${IDLE_COLOR}" down --remove-orphans 2>/dev/null || true
  exit 1
fi
echo "Candidata ${IDLE_COLOR} validada com sucesso."

# --- [4/4] cutover: promove a candidata para as portas publicas --------------

echo "== [4/4] Cutover: promovendo ${IDLE_COLOR} para :${REAL_BACKEND_PORT}/:${REAL_FRONTEND_PORT} =="

# Libera as portas publicas parando (sem remover) a versao anterior.
if [[ -n "${ACTIVE_COLOR}" ]]; then
  echo "Parando cor ativa anterior (${ACTIVE_COLOR})..."
  COLOR="${ACTIVE_COLOR}" "${COMPOSE_BASE[@]}" -p "devflow_${ACTIVE_COLOR}" stop || true
fi
echo "Parando containers legados, se existirem..."
docker stop devflow_backend devflow_frontend 2>/dev/null || true

# Recria a candidata (imagem ja validada e quente) nas portas reais.
if ! COLOR="${IDLE_COLOR}" \
     BACKEND_BIND="${REAL_BACKEND_PORT}" \
     FRONTEND_BIND="${REAL_FRONTEND_PORT}" \
     timeout 10m "${COMPOSE_BASE[@]}" -p "devflow_${IDLE_COLOR}" up -d --force-recreate --remove-orphans; then
  echo "ERRO: falha ao promover ${IDLE_COLOR} nas portas reais."
  restore_previous
  exit 1
fi

# Revalida ja nas portas publicas.
if ! wait_backend_healthy "${REAL_BACKEND_PORT}" "${BACKEND_CANDIDATE}" \
   || ! wait_frontend_healthy "${REAL_FRONTEND_PORT}" "${FRONTEND_CANDIDATE}"; then
  echo "ERRO: ${IDLE_COLOR} nao respondeu nas portas publicas apos o cutover."
  restore_previous
  exit 1
fi

# --- sucesso: registra a nova cor ativa e preserva a anterior p/ rollback ----

echo "${IDLE_COLOR}" > "${ACTIVE_COLOR_FILE}"
echo "Cor ativa agora: ${IDLE_COLOR}."

# Remove os containers legados obsoletos (so existem no 1o deploy blue-green).
docker rm devflow_backend devflow_frontend 2>/dev/null || true

if [[ -n "${ACTIVE_COLOR}" ]]; then
  echo "Cor anterior (${ACTIVE_COLOR}) mantida PARADA para rollback rapido (scripts/rollback.sh)."
fi

# Limpeza pos-deploy. Nao remove imagens/containers das cores (a anterior fica
# parada mas atrelada a sua imagem/rede, entao os prunes nao a afetam).
echo "Limpando imagens/builder/redes nao utilizados..."
docker image prune -f || true
docker builder prune -f --filter "until=168h" || true
docker network prune -f || true

echo "Espaco em disco apos o deploy:"
df -h || true

if grep -Eq 'NEXT_PUBLIC_API_URL=.*localhost' .env.production 2>/dev/null; then
  echo "AVISO: NEXT_PUBLIC_API_URL aponta para localhost. No browser de producao a API ficara inacessivel."
fi

echo "Estado final dos containers devflow:"
docker ps -a --filter "name=devflow_" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' || true

echo "Deploy blue-green concluido com sucesso. Cor ativa: ${IDLE_COLOR}."
