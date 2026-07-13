# API de Ações do DevFlow (curl + API key)

Todas as ações do sistema podem ser chamadas por **curl**, autenticando com uma
**API key que o próprio usuário gera**. Nenhuma configuração nova é necessária —
já está no ar no backend.

- Base da API (produção): `http://143.198.155.216:4011/api`
- Autenticação: header `Authorization: Bearer df_...`
- A key herda as **permissões do usuário** e pode ser **restringida a escopos** na criação.

---

## 1. Gerar a sua API key

**Pela interface (recomendado):** entre no app → **Perfil** → painel *Tokens de API* →
dê um nome, escolha os escopos e gere. A key (`df_...`) aparece **uma única vez** —
copie e guarde.

**Por curl:** primeiro pegue um token de sessão (login) e depois crie a key.

```bash
API="http://143.198.155.216:4011/api"

# 1) login → token de sessão (JWT)
TOKEN=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@empresa.com","password":"SUA_SENHA","tenantSlug":"desenvolvimento"}' \
  | sed -E 's/.*"token":"([^"]+)".*/\1/')

# 2) gerar a API key (escopos = permissões que a key poderá usar)
curl -s -X POST "$API/api-tokens" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Integração n8n","scopes":["tasks:read","tasks:create","tasks:update","projects:read","modules:read","epics:read","users:read","time-logs:create"]}'
# → { "token": "df_xxxxxxxx...", "tokenPrefix": "df_xxxx", "scopes":[...], ... }
```

> Escopos disponíveis: `GET /api/api-tokens/available-scopes` (admin vê todos).
> Gerenciar/revogar: `GET /api/api-tokens`, `DELETE /api/api-tokens/:id`.

A partir daqui, use a **key** (`df_...`) em tudo:

```bash
KEY="df_xxxxxxxx..."
```

---

## 2. Catálogo de ações (endpoint → escopo)

### Tarefas
| Ação | Método / rota | Escopo |
|------|---------------|--------|
| Criar tarefa | `POST /tasks` | `tasks:create` |
| Atualizar / mudar status | `PUT /tasks/:id` | `tasks:update` |
| Marcar urgente | `PATCH /tasks/:id/urgent` | `tasks:update` |
| Reordenar no kanban | `PATCH /tasks/kanban/order` | `tasks:update` |
| Excluir | `DELETE /tasks/:id` | `tasks:delete` |
| Minhas tarefas | `GET /tasks/me` | `tasks:read` |
| Por projeto / por responsável / por id | `GET /tasks/project/:id` · `/assignee/:id` · `/:id` | `tasks:read` |

### Projetos
| Ação | Método / rota | Escopo |
|------|---------------|--------|
| Listar / detalhe | `GET /projects` · `/projects/:id` | `projects:read` |
| Criar / atualizar / excluir | `POST /projects` · `PUT /projects/:id` · `DELETE /projects/:id` | `projects:create/update/delete` |
| Reordenar a fila | `POST /projects/queue/reorder` | `projects:update` |
| Adicionar/remover dev | `POST`/`DELETE /projects/:id/developers/:userId` | `projects:update` |

### Módulos e Épicos
| Ação | Método / rota | Escopo |
|------|---------------|--------|
| Listar módulos do projeto | `GET /projects/:projectId/modules` | `modules:read` |
| Criar / atualizar / excluir módulo | `POST /modules` · `PATCH /modules/:id` · `DELETE /modules/:id` | `modules:create/update/delete` |
| Listar / criar / atualizar épico | `GET /projects/:projectId/epics` · `POST /epics` · `PATCH /epics/:id` | `epics:read/create/update` |

### Empresas · Usuários · Horas
| Ação | Método / rota | Escopo |
|------|---------------|--------|
| Empresas | `GET/POST /companies` · `PATCH/DELETE /companies/:id` | `companies:*` |
| Usuários (listar) | `GET /users` | `users:read` |
| Registrar horas | `POST /time-logs` | `time-logs:create` |

---

## 3. Exemplos de curl

**Listar projetos:**
```bash
curl -s "$API/projects" -H "Authorization: Bearer $KEY"
```

**Criar uma tarefa** (precisa de projeto + módulo + épico + responsável — veja o
fluxo completo em [`api-criar-tarefas.md`](api-criar-tarefas.md)):
```bash
curl -s -X POST "$API/tasks" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{
    "projectId":"<PROJ_ID>", "moduleId":"<MOD_ID>", "epicId":"<EPIC_ID>",
    "assigneeId":"<USER_ID>", "reporterId":"<USER_ID>",
    "title":"Ajustar tela de login", "description":"...", "status":"BACKLOG",
    "complexity":3, "estimatedHours":8
  }'
```

**Mudar o status de uma tarefa:**
```bash
curl -s -X PUT "$API/tasks/<TASK_ID>" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"status":"EM_DESENVOLVIMENTO"}'
```

**Registrar horas:**
```bash
curl -s -X POST "$API/time-logs" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"taskId":"<TASK_ID>","hours":2.5,"description":"Implementação","date":"2026-07-11","status":"EM_DESENVOLVIMENTO"}'
```

---

## 4. Escopos e segurança

- A key só faz o que os **escopos** dela permitem — e nunca além das permissões do
  usuário dono. Uma key `tasks:read` não cria nada.
- A key vale para o **tenant do usuário** que a gerou (isolamento multi-tenant).
- Revogue a qualquer momento em *Perfil → Tokens de API* ou `DELETE /api/api-tokens/:id`.
- O e-mail é disparado **automaticamente pela automação (n8n)** — não passa por esta API.

## 5. Erros comuns
- **401** — key ausente/errada/revogada, ou usuário inativo/não aprovado.
- **403** — a key não tem o escopo exigido pela rota.
- **400** — corpo fora do contrato (campos obrigatórios/inválidos).
