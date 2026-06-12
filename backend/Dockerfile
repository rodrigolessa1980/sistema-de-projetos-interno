# syntax=docker/dockerfile:1.4
FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json .npmrc ./
# postinstall precisa de scripts/ e prisma/ — prisma generate roda no estágio builder
RUN npm ci --no-audit --no-fund --ignore-scripts

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Credenciais reais de backend/.env (injetadas via compose secret no build)
RUN --mount=type=secret,id=backend_env,target=/app/.env,required \
    npx prisma generate

RUN --mount=type=secret,id=backend_env,target=/app/.env,required \
    npm run build

RUN npm prune --omit=dev --no-audit --no-fund

FROM base AS runner
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/infra/config ./src/infra/config
COPY docker-entrypoint.sh ./docker-entrypoint.sh
COPY healthcheck.js ./healthcheck.js
RUN chmod +x docker-entrypoint.sh

EXPOSE 4011
HEALTHCHECK --interval=15s --timeout=5s --retries=8 --start-period=120s \
  CMD ["node", "healthcheck.js"]

ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
