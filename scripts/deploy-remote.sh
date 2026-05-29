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
  echo "Primeiro deploy: clonando repositório em ${DEPLOY_PATH}..."
  mkdir -p "$(dirname "${DEPLOY_PATH}")"
  git clone --branch "${BRANCH}" --single-branch "${REPO_URL}" "${DEPLOY_PATH}"
else
  echo "Atualizando repositório em ${DEPLOY_PATH}..."
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

echo "Commit deployado: $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "Parando containers em execução..."
"${COMPOSE[@]}" down --remove-orphans || true

echo "Construindo e iniciando containers de produção..."
"${COMPOSE[@]}" up -d --build --remove-orphans

echo "Deploy concluído."
"${COMPOSE[@]}" ps
