#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Rollback instantaneo do deploy blue-green.
#
# Devolve as portas publicas para a cor ANTERIOR (que o deploy deixou parada,
# nao removida). Nao faz git pull nem rebuild: apenas troca qual cor esta no ar.
#
# Uso no servidor:
#   bash /opt/devflow/scripts/rollback.sh
# =============================================================================

DEPLOY_PATH="${DEPLOY_PATH:-/opt/devflow}"
STATE_DIR="${STATE_DIR:-$(dirname "${DEPLOY_PATH}")/devflow-state}"
ACTIVE_COLOR_FILE="${STATE_DIR}/active_color"

REAL_BACKEND_PORT="${REAL_BACKEND_PORT:-4011}"
REAL_FRONTEND_PORT="${REAL_FRONTEND_PORT:-8022}"

cd "${DEPLOY_PATH}"

CURRENT_COLOR="$(cat "${ACTIVE_COLOR_FILE}" 2>/dev/null || true)"
case "${CURRENT_COLOR}" in
  blue)  PREV_COLOR="green" ;;
  green) PREV_COLOR="blue" ;;
  *)
    echo "Erro: nenhuma cor ativa valida em ${ACTIVE_COLOR_FILE} (valor: '${CURRENT_COLOR:-<vazio>}')."
    echo "Nao ha estado blue-green para reverter."
    exit 1
    ;;
esac

# Confirma que a cor anterior ainda existe (containers parados aguardando rollback).
if [[ -z "$(docker ps -aq --filter "name=devflow_backend_${PREV_COLOR}")" ]]; then
  echo "Erro: nao ha containers da cor anterior (${PREV_COLOR}) para reativar."
  echo "Rollback impossivel — a versao anterior nao esta mais no servidor."
  exit 1
fi

echo "Rollback: cor atual '${CURRENT_COLOR}' -> cor anterior '${PREV_COLOR}'."

set -a
if [[ -f .env.production ]]; then
  # shellcheck disable=SC1091
  source .env.production
fi
set +a

COMPOSE_BASE=(docker compose
  --env-file .env.production
  --env-file backend/.env
  -f docker-compose.prod.yml
)

wait_backend_healthy() {
  local port="$1" container="$2" attempt
  for attempt in $(seq 1 24); do
    if curl -sf --max-time 5 "http://127.0.0.1:${port}/api/health" >/dev/null; then
      echo "Backend saudavel (${container} em :${port})."
      return 0
    fi
    echo "Aguardando backend (${container})... (${attempt}/24)"
    sleep 5
  done
  echo "ERRO: backend (${container}) nao respondeu apos o rollback."
  docker logs "${container}" --tail 100 2>&1 || true
  return 1
}

# Para a cor atual para liberar as portas publicas.
echo "Parando cor atual (${CURRENT_COLOR})..."
COLOR="${CURRENT_COLOR}" "${COMPOSE_BASE[@]}" -p "devflow_${CURRENT_COLOR}" stop || true

# Reativa a cor anterior. Ela foi apenas parada (mantem o bind das portas reais),
# entao `start` basta; se nao existir mais, recria a partir da imagem.
echo "Reativando cor anterior (${PREV_COLOR}) em :${REAL_BACKEND_PORT}/:${REAL_FRONTEND_PORT}..."
if ! COLOR="${PREV_COLOR}" "${COMPOSE_BASE[@]}" -p "devflow_${PREV_COLOR}" start; then
  COLOR="${PREV_COLOR}" BACKEND_BIND="${REAL_BACKEND_PORT}" FRONTEND_BIND="${REAL_FRONTEND_PORT}" \
    "${COMPOSE_BASE[@]}" -p "devflow_${PREV_COLOR}" up -d --force-recreate
fi

if ! wait_backend_healthy "${REAL_BACKEND_PORT}" "devflow_backend_${PREV_COLOR}"; then
  echo "ERRO: rollback subiu, mas o backend nao respondeu. Verifique manualmente."
  exit 1
fi

echo "${PREV_COLOR}" > "${ACTIVE_COLOR_FILE}"
echo "Rollback concluido. Cor ativa agora: ${PREV_COLOR}."
echo "A cor '${CURRENT_COLOR}' ficou parada."

docker ps -a --filter "name=devflow_" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' || true
