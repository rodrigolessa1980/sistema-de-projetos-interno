FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json .npmrc ./
RUN npm install --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# prisma generate não conecta ao banco; valores dummy só para carregar prisma.config.ts
ENV MYSQL_HOST=build \
    MYSQL_PORT=3306 \
    MYSQL_USER=build \
    MYSQL_PASSWORD=build \
    MYSQL_DATABASE=build

RUN npx prisma generate
RUN npm run build

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
RUN chmod +x docker-entrypoint.sh

EXPOSE 4011

ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
