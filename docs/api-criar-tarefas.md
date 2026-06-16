# Tutorial: criar tarefas via API

Como adicionar tarefas no DevFlow programaticamente (script, automação, CI), usando um **token de API** (`df_...`). Testado de ponta a ponta em 14/06/2026.

---

## Visão geral do fluxo

Criar uma tarefa exige 5 IDs. O caminho é sempre:

```
Token (df_...)  →  Projeto  →  Módulo + Épico  →  Usuário (responsável)  →  POST /tasks
```

| Precisa de | Vem de | Escopo necessário |
|------------|--------|-------------------|
| `projectId` | `GET /projects` | `projects:read` |
| `moduleId` | `GET /projects/:id/modules` | `modules:read` |
| `epicId` | `GET /projects/:id/epics` | `epics:read` |
| `assigneeId` / `reporterId` | `GET /users` | `users:read` |
| criar a tarefa | `POST /tasks` | **`tasks:create`** |

> A base da API é `http://localhost:4011/api` em dev. Em produção use a URL pública do backend (`/api`).

---

## Passo 1 — Gerar um token

1. Entre no app → **Perfil** → aba **API**.
2. Dê um nome (ex: `Automação local`).
3. Marque **"Usar todas as minhas permissões"** (mais simples) **ou** selecione os escopos da tabela acima.
4. Clique **Gerar token** e **copie o `df_...` na hora** — ele não é mostrado de novo.

O token herda as permissões da sua conta. Admin pode tudo; um colaborador só recebe os escopos que já tem.

---

## Passo 2 — Autenticação

Todas as chamadas usam o header:

```
Authorization: Bearer df_seu_token_aqui
Content-Type: application/json
```

---

## Passo 3 — Descobrir os IDs

### Listar projetos
```bash
curl -s http://localhost:4011/api/projects \
  -H "Authorization: Bearer $DEVFLOW_TOKEN"
# → [ { "id": "...", "name": "Anomalias de Transporte", ... }, ... ]
```

### Listar módulos e épicos de um projeto
```bash
curl -s http://localhost:4011/api/projects/<PROJECT_ID>/modules \
  -H "Authorization: Bearer $DEVFLOW_TOKEN"
# → { "modules": [ { "id": "...", "name": "..." } ] }

curl -s http://localhost:4011/api/projects/<PROJECT_ID>/epics \
  -H "Authorization: Bearer $DEVFLOW_TOKEN"
# → { "epics": [ { "id": "...", "moduleId": "...", "name": "..." } ] }
```

> A tarefa **exige um `epicId`**. Cada módulo importado do relatório já tem um épico associado (escolha o épico cujo `moduleId` bate com o módulo).

### Listar usuários (responsável)
```bash
curl -s http://localhost:4011/api/users \
  -H "Authorization: Bearer $DEVFLOW_TOKEN"
# → [ { "id": "...", "name": "Rafael ...", ... }, ... ]
```

---

## Passo 4 — Criar a tarefa

```bash
curl -s -X POST http://localhost:4011/api/tasks \
  -H "Authorization: Bearer $DEVFLOW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "<PROJECT_ID>",
    "moduleId": "<MODULE_ID>",
    "epicId": "<EPIC_ID>",
    "title": "Minha tarefa via API",
    "description": "Descrição da tarefa",
    "assigneeId": "<USER_ID>",
    "reporterId": "<USER_ID>",
    "complexity": 1,
    "estimatedHours": 2,
    "status": "BACKLOG"
  }'
```

### PowerShell (Windows)
```powershell
$headers = @{ Authorization = "Bearer $env:DEVFLOW_TOKEN"; "Content-Type" = "application/json" }
$body = @{
  projectId   = "<PROJECT_ID>"
  moduleId    = "<MODULE_ID>"
  epicId      = "<EPIC_ID>"
  title       = "Minha tarefa via API"
  description = "Descrição da tarefa"
  assigneeId  = "<USER_ID>"
  reporterId  = "<USER_ID>"
  status      = "BACKLOG"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:4011/api/tasks" -Method Post -Headers $headers -Body $body
```

---

## Campos da tarefa

**Obrigatórios:** `projectId`, `moduleId`, `epicId`, `title`, `description`, `assigneeId`, `reporterId`.

**Opcionais:** `status`, `complexity` (int), `estimatedHours` (int), `actualHours` (number), `order` (int), `startDate` / `dueDate` (ISO `YYYY-MM-DD`), `blockedReason`, `isUrgent` (bool), `parentTaskId`.

**Valores válidos de `status`:** `BACKLOG`, `PLANEJADA`, `BLOQUEADA`, `EM_DESENVOLVIMENTO`, `EM_REVISAO`, `HOMOLOGACAO`, `CONCLUIDA`, `CANCELADA`. (Se omitido, entra como `BACKLOG`.)

---

## Passo 5 — Testar com o script pronto

O script [`scripts/criar-tarefa-api.mjs`](../scripts/criar-tarefa-api.mjs) faz todo o fluxo sozinho (descobre os IDs e cria a tarefa). Útil para validar o token antes de automatizar.

**Pré-requisitos:** backend rodando (`npm run start` em `backend/`) e um token.

```powershell
# Só lista os IDs disponíveis — NÃO cria nada (seguro)
$env:DEVFLOW_TOKEN="df_xxx"; node scripts/criar-tarefa-api.mjs --listar

# Cria uma tarefa de teste no primeiro projeto
$env:DEVFLOW_TOKEN="df_xxx"; node scripts/criar-tarefa-api.mjs
```

```bash
# bash / Linux / macOS
DEVFLOW_TOKEN=df_xxx node scripts/criar-tarefa-api.mjs --listar
DEVFLOW_TOKEN=df_xxx node scripts/criar-tarefa-api.mjs
```

**Variáveis opcionais:**

| Variável | Efeito | Padrão |
|----------|--------|--------|
| `DEVFLOW_API` | base da API | `http://localhost:4011/api` |
| `DEVFLOW_TOKEN` | token `df_...` | — (obrigatório) |
| `DEVFLOW_PROJECT` | escolhe projeto por nome (parcial) | primeiro projeto |
| `DEVFLOW_TITULO` | título da tarefa criada | `Tarefa via API - <data>` |

---

## Erros comuns

| Resposta | Causa | Solução |
|----------|-------|---------|
| `401 Token de autenticação ausente` | header faltando ou errado | use `Authorization: Bearer df_...` |
| `401 Token de API inválido, expirado ou revogado` | token revogado/expirado | gere um novo em Perfil → API |
| `403` (Forbidden) | token sem o escopo necessário | recrie o token com `tasks:create` (e os `:read` para descoberta) |
| `400` com lista de campos | faltou campo obrigatório ou `status` inválido | confira a seção "Campos da tarefa" |
| connection refused / `000` | backend não está rodando | suba o backend na porta 4011 |

---

## Referências

- Controller: `backend/src/infra/http/controllers/tasks.controller.ts` (`POST /tasks`)
- Autenticação por token: `backend/src/infra/http/guards/jwt-auth.guard.ts`
- Geração de token (UI): Perfil → aba API (`src/features/api-tokens/api-tokens-panel.tsx`)
- Script de teste: `scripts/criar-tarefa-api.mjs`
