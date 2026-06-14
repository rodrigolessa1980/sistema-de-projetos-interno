#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/devflow}"
REPO_URL="${REPO_URL:-https://github.com/rodrigolessa1980/sistema-de-projetos-interno.git}"
BRANCH="${BRANCH:-main}"

if [[ -z "${ENV_BACKEND:-}" || -z "${ENV_FRONTEND:-}" ]]; then
  echo "Erro: ENV_BACKEND e ENV_FRONTEND devem estar definidos."
  exit 1
fi

if ! printf '%s\n' "${ENV_FRONTEND}" | grep -q '^NEXT_PUBLIC_API_URL='; then
  echo "Erro: ENV_FRONTEND deve conter NEXT_PUBLIC_API_URL (mesmo padrao do .env.local)."
  exit 1
fi

if [[ ! -d "${DEPLOY_PATH}/.git" ]]; then
  echo "Primeiro deploy: clonando repositorio em ${DEPLOY_PATH}..."
  mkdir -p "$(dirname "${DEPLOY_PATH}")"
  git clone --branch "${BRANCH}" --single-branch "${REPO_URL}" "${DEPLOY_PATH}"
else
  echo "Atualizando repositorio em ${DEPLOY_PATH}..."
  cd "${DEPLOY_PATH}"
  git fetch origin "${BRANCH}"
  git reset --hard "origin/${BRANCH}"
  git clean -fd
  git pull origin "${BRANCH}"
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

COMPOSE=(docker compose
  --env-file .env.production
  --env-file backend/.env
  -f docker-compose.prod.yml
)

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "Espaco em disco antes da limpeza:"
df -h || true

echo "Limpando apenas containers parados antes do build..."
docker container prune -f || true

echo "Construindo imagens antes de trocar os containers..."
timeout 35m "${COMPOSE[@]}" build

echo "Subindo backend..."
if ! timeout 10m "${COMPOSE[@]}" up -d --remove-orphans backend; then
  echo "ERRO: falha ao subir devflow_backend."
  docker logs devflow_backend --tail 200 2>&1 || true
  exit 1
fi

echo "Aguardando backend responder em /api/health..."
backend_ready=0
for attempt in $(seq 1 36); do
  if curl -sf "http://127.0.0.1:4011/api/health" >/dev/null; then
    echo "Backend saudavel na tentativa ${attempt}."
    backend_ready=1
    break
  fi

  echo "Tentativa ${attempt}/36: backend ainda indisponivel..."
  backend_logs="$(docker logs devflow_backend --tail 40 2>&1 || true)"
  echo "${backend_logs}"

  if echo "${backend_logs}" | grep -qE 'MODULE_NOT_FOUND|Cannot find module|Falha ao iniciar a API|Error:'; then
    echo "ERRO: backend falhou ao iniciar (nao adianta aguardar)."
    docker logs devflow_backend --tail 200 2>&1 || true
    exit 1
  fi

  sleep 5
done

if [[ "${backend_ready}" -ne 1 ]]; then
  echo "ERRO: backend nao respondeu apos 3 minutos."
  docker logs devflow_backend --tail 200 2>&1 || true
  exit 1
fi

echo "Subindo frontend..."
if ! timeout 10m "${COMPOSE[@]}" up -d --remove-orphans frontend; then
  echo "ERRO: falha ao subir devflow_frontend."
  docker logs devflow_frontend --tail 120 2>&1 || true
  exit 1
fi

echo "Limpando imagens antigas nao utilizadas apos deploy bem-sucedido..."
docker image prune -f || true
docker builder prune -f --filter "until=168h" || true
docker network prune -f || true

echo "Espaco em disco apos o deploy:"
df -h || true

echo "Verificando containers..."
"${COMPOSE[@]}" ps -a

if grep -Eq 'NEXT_PUBLIC_API_URL=.*localhost' .env.production 2>/dev/null; then
  echo "AVISO: NEXT_PUBLIC_API_URL aponta para localhost. No browser de producao a API ficara inacessivel."
fi

echo "Deploy concluido."
"${COMPOSE[@]}" ps
