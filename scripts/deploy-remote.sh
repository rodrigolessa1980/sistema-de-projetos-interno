#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/devflow}"
REPO_URL="${REPO_URL:-https://github.com/rodrigolessa1980/sistema-de-projetos-interno.git}"
BRANCH="${BRANCH:-main}"

COMPOSE=(docker compose
  --env-file .env.production
  --env-file backend/.env
  -f docker-compose.prod.yml
)

if [[ -z "${ENV_BACKEND:-}" || -z "${ENV_FRONTEND:-}" ]]; then
  echo "Erro: ENV_BACKEND e ENV_FRONTEND devem estar definidos."
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

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "Espaco em disco antes da limpeza:"
df -h || true

echo "Limpando apenas containers parados antes do build..."
docker container prune -f || true

echo "Construindo imagens antes de trocar os containers..."
timeout 35m "${COMPOSE[@]}" build

echo "Iniciando containers de producao..."
timeout 10m "${COMPOSE[@]}" up -d --remove-orphans

echo "Limpando imagens antigas nao utilizadas apos deploy bem-sucedido..."
docker image prune -f || true
docker builder prune -f --filter "until=168h" || true
docker network prune -f || true

echo "Espaco em disco apos o deploy:"
df -h || true

echo "Verificando containers..."
sleep 5
"${COMPOSE[@]}" ps -a

if ! docker ps --format '{{.Names}}' | grep -qx 'devflow_backend'; then
  echo "ERRO: devflow_backend nao esta em execucao."
  docker logs devflow_backend --tail 120 2>&1 || true
  exit 1
fi

if ! curl -sf "http://127.0.0.1:4011/api/health" >/dev/null; then
  echo "ERRO: backend nao responde em http://127.0.0.1:4011/api/health"
  docker logs devflow_backend --tail 120 2>&1 || true
  exit 1
fi

if grep -Eq 'VITE_API_URL=.*localhost' .env.production 2>/dev/null; then
  echo "AVISO: VITE_API_URL aponta para localhost. No browser de producao a API ficara inacessivel."
  echo "       Use http://143.198.155.216:4011/api (ou o dominio real) no secret ENV_FRONTEND."
fi

echo "Deploy concluido."
"${COMPOSE[@]}" ps
