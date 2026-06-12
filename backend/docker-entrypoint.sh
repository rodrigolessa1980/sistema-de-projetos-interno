#!/bin/sh
set -e

MAX_RETRIES=12
RETRY_DELAY=5

echo "Aplicando migrations..."
attempt=1
while [ "$attempt" -le "$MAX_RETRIES" ]; do
  if npx prisma migrate deploy; then
    echo "Migrations aplicadas com sucesso."
    break
  fi

  if [ "$attempt" -eq "$MAX_RETRIES" ]; then
    echo "Falha ao aplicar migrations após ${MAX_RETRIES} tentativas."
    exit 1
  fi

  echo "Tentativa ${attempt}/${MAX_RETRIES} falhou (MySQL indisponível?). Aguardando ${RETRY_DELAY}s..."
  attempt=$((attempt + 1))
  sleep "$RETRY_DELAY"
done

echo "Iniciando API..."
exec node dist/main.js
