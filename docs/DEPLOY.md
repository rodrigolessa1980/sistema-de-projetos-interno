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

Mesmas variáveis de `backend/.env.example`:

```env
MYSQL_HOST=host.docker.internal
MYSQL_PORT=3306
MYSQL_USER=devflow_user
MYSQL_PASSWORD=devflow_password
MYSQL_DATABASE=devflow_db
JWT_SECRET=change-this-development-secret
PORT=4011
CORS_ORIGIN=http://localhost:8022,http://127.0.0.1:8022,http://143.198.155.216:8022
```

### Exemplo `ENV_FRONTEND`

Mesmas variáveis de `.env.local` (produção):

```env
PORT=8022
NEXT_PUBLIC_API_URL=http://143.198.155.216:4011/api
```

> `NEXT_PUBLIC_API_URL` é embutida no build do Vite. Se mudar a URL da API, dispare um novo deploy.

## Fluxo do deploy (blue-green, sem proxy)

O workflow `.github/workflows/deploy.yml` é acionado por:

- Push na branch `main`
- Execução manual (**Actions → Deploy Produção → Run workflow**)

O deploy **não derruba a produção para validar a versão nova**. Cada deploy sobe
a versão nova como uma **cor** (`blue`/`green`) alternada, **primeiro numa porta
temporária local**, e só troca (cutover) para as portas públicas depois que ela
passa no health check.

Passos executados por `scripts/deploy-remote.sh` no servidor (`/opt/devflow`):

1. **Primeiro deploy:** `git clone`. **Deploys seguintes:** `git reset --hard origin/main` + `git clean -fd`.
2. Grava `ENV_BACKEND` em `backend/.env` e `ENV_FRONTEND` em `.env.production`.
3. Lê a **cor ativa** em `${STATE_DIR}/active_color` e define a cor candidata (a outra).
4. **Build** e **sobe a candidata em porta temporária** (`127.0.0.1:4012` backend / `127.0.0.1:8023` frontend). A versão ativa **continua atendendo** em `4011`/`8022`.
5. **Valida a candidata** (`/api/health` no backend + HTTP no frontend). Se falhar aqui, **a produção nunca é tocada** e o deploy aborta.
6. **Cutover:** para a versão anterior e recria a candidata nas portas públicas `4011`/`8022`. Única janela de downtime (~poucos segundos). Revalida nas portas reais.
7. Grava a nova cor ativa. A **cor anterior fica parada (não removida)** para rollback instantâneo.

O `backend/.env` real é injetado no build via Docker secret (Prisma generate/migrate)
e no runtime via `env_file`. As cores rodam como projetos Compose separados
(`docker compose -p devflow_blue` / `-p devflow_green`).

### Estado da cor ativa

O arquivo `active_color` fica em `${STATE_DIR}` (padrão `/opt/devflow-state/`),
**fora** do `/opt/devflow` — o deploy roda `git clean -fd`, que apagaria qualquer
arquivo dentro do repositório.

```bash
cat /opt/devflow-state/active_color   # blue | green
```

## Rollback

Para voltar **instantaneamente** para a versão anterior (a cor que ficou parada),
sem rebuild nem git pull:

```bash
bash /opt/devflow/scripts/rollback.sh
```

Ele para a cor atual e reativa a anterior nas portas públicas, invertendo o
`active_color`.

> ⚠️ **Migrations (banco compartilhado):** o backend roda `prisma migrate deploy`
> ao subir a candidata, contra o **mesmo** banco que a versão ativa ainda usa. Uma
> migration **destrutiva** (DROP/RENAME de coluna, mudança de tipo) pode quebrar a
> versão antiga durante a sobreposição — e **não é revertida pelo rollback** (o
> rollback troca containers, não desfaz o schema). Para deploys 100% seguros, use
> migrations retrocompatíveis (expand-contract).

## Repositório privado

Se o repositório for privado, configure no servidor uma das opções:

- Deploy key do GitHub no servidor
- Ou `git config credential.helper` com token de acesso

## Deploy manual no servidor

```bash
export ENV_BACKEND="$(cat backend/.env.example)"   # substitua pelos valores reais
export ENV_FRONTEND="$(cat env.production.example)"
bash scripts/deploy-remote.sh
```

## Serviços

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend | 8022 | `http://servidor:8022` |
| Backend API | 4011 | `http://servidor:4011/api` |

As portas e URLs públicas **não mudam** com o blue-green — só os nomes dos
containers passam a ter sufixo de cor: `devflow_backend_<cor>` e
`devflow_frontend_<cor>` (`<cor>` = `blue` ou `green`).

O banco MySQL é externo (configurado via `ENV_BACKEND`). Não há container de banco no compose de produção.

> **MySQL no mesmo servidor:** use `MYSQL_HOST=host.docker.internal` (ou o IP `143.198.155.216`). **Não** use `127.0.0.1` — dentro do container isso aponta para o próprio container, não para o host.

## Diagnóstico rápido

Se o frontend sobe mas o login falha com `localhost:4011`:

```bash
docker ps -a | grep devflow
COLOR=$(cat /opt/devflow-state/active_color)   # blue | green
docker logs devflow_backend_$COLOR --tail 100
curl -s http://127.0.0.1:4011/api/health
cat /opt/devflow/.env.production
```

| Sintoma | Causa provável | Correção |
|---------|----------------|----------|
| Request para `localhost:4011` no browser | `ENV_FRONTEND` com `NEXT_PUBLIC_API_URL=http://localhost:4011/api` | Atualizar secret e redeploy |
| `devflow_backend_<cor>` ausente ou `Exited` | MySQL inacessível, migration falhou ou env incompleto | Ver `docker logs devflow_backend_<cor>`; corrigir `ENV_BACKEND`. Se a candidata falhou, a cor anterior segue no ar |
| Backend `Exited (1)` após 5 tentativas | Política antiga `on-failure:5` | Pull + redeploy (agora usa `unless-stopped`) |
| `Can't connect to MySQL server` | `MYSQL_HOST=127.0.0.1` no container | Usar `host.docker.internal` ou IP do servidor |
