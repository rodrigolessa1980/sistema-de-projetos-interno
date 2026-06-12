# Deploy em produção (Docker + GitHub Actions)

## Pré-requisitos no servidor

- Docker Engine + Docker Compose plugin
- Git
- Portas **8022** (frontend) e **4011** (backend) liberadas
- Usuário SSH com permissão para executar Docker

## Secrets no GitHub

Configure em **Settings → Secrets and variables → Actions**:

| Secret | Descrição |
|--------|-----------|
| `SERVER_HOST` | IP ou hostname do servidor |
| `SERVER_USER` | Usuário SSH |
| `SERVER_PASSWORD` | Senha SSH (método principal) |
| `SERVER_SSH` | Chave privada SSH (fallback se a senha falhar) |
| `ENV_BACKEND` | Conteúdo completo do `backend/.env` (multilinha) |
| `ENV_FRONTEND` | Conteúdo completo do `.env.production` (multilinha) |

### Exemplo `ENV_BACKEND`

```env
MYSQL_HOST=143.198.155.216
MYSQL_PORT=3306
MYSQL_USER=quality_
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=devflow_db
JWT_SECRET=segredo-forte-aqui
PORT=4011
CORS_ORIGIN=https://seu-dominio.com
NODE_ENV=production
```

### Exemplo `ENV_FRONTEND`

```env
VITE_API_URL=https://api.seu-dominio.com/api
PORT=8022
```

> `VITE_API_URL` e embutida no build do Vite. Se mudar a URL da API, dispare um novo deploy.

## Fluxo do deploy

O workflow `.github/workflows/deploy.yml` é acionado por:

- Push na branch `main`
- Execução manual (**Actions → Deploy Produção → Run workflow**)

Passos executados no servidor (`/opt/devflow`):

1. **Primeiro deploy:** `git clone` do repositório
2. **Deploys seguintes:** `git reset --hard origin/main` + `git pull` (descarta alterações locais)
3. Grava `ENV_BACKEND` em `backend/.env` e `ENV_FRONTEND` em `.env.production`
4. `docker compose down` nos containers atuais
5. `docker compose up -d --build` com `docker-compose.prod.yml` — o `backend/.env` real é injetado no build via Docker secret (Prisma generate/migrate) e no runtime via `env_file`

## Repositório privado

Se o repositório for privado, configure no servidor uma das opções:

- Deploy key do GitHub no servidor
- Ou `git config credential.helper` com token de acesso

## Deploy manual no servidor

```bash
export ENV_BACKEND="$(cat backend/.env.example)"   # substitua pelos valores reais
export ENV_FRONTEND="$(cat .env.production.example)"
bash scripts/deploy-remote.sh
```

## Serviços

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend | 8022 | `http://servidor:8022` |
| Backend API | 4011 | `http://servidor:4011/api` |

O banco MySQL é externo (configurado via `ENV_BACKEND`). Não há container de banco no compose de produção.
