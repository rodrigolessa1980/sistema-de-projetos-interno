# Mapeamento de Cobertura Frontend x Backend

## Status atual

Objetivo: remover mocks e garantir que os dados do frontend venham das rotas do backend.

## Rotas com cobertura implementada no frontend

- `POST /auth/login` -> `src/lib/auth.ts`
- `POST /auth/register` -> `src/lib/auth.ts`
- `GET /auth/me` -> `src/stores/auth-store.ts`
- `GET /projects` -> `src/stores/project-store.ts` (`fetchProjects`)
- `POST /projects` -> `src/stores/project-store.ts` (`createProject`)
- `PUT /projects/:id` -> `src/stores/project-store.ts` (`updateProject`)
- `DELETE /projects/:id` -> `src/stores/project-store.ts` (`deleteProject`)
- `POST /projects/queue/reorder` -> `src/stores/project-store.ts` (`reorderQueue`)
- `GET /companies` -> `src/stores/project-store.ts` (`fetchProjects`)
- `POST /companies` -> `src/stores/project-store.ts` (`createCompany`, otimista)
- `PATCH /companies/:id` -> `src/stores/project-store.ts` (`updateCompany`, otimista)
- `DELETE /companies/:id` -> `src/stores/project-store.ts` (`deleteCompany`, otimista)
- `GET /tasks/project/:projectId` -> `src/hooks/use-tasks.ts` (`useTasks`)
- `GET /tasks/:id` -> `src/hooks/use-tasks.ts` (`useTask`)
- `POST /tasks` -> `src/stores/task-store.ts` (`createTask`)
- `PUT /tasks/:id` -> `src/stores/task-store.ts` (`updateTask`, `updateTaskStatus`)
- `DELETE /tasks/:id` -> `src/stores/task-store.ts` (`deleteTask`)
- `PATCH /tasks/:id/urgent` -> `src/stores/task-store.ts` (`setTaskUrgent`)
- `PATCH /tasks/kanban/order` -> `src/hooks/use-tasks.ts` e `src/stores/task-store.ts`
- `POST /time-logs` -> `src/stores/task-store.ts` (`logTime`)

## Lacunas de rota (impedem cobertura de 100% de domínio)

Estas entidades ainda existem no frontend, mas sem endpoint no backend para leitura/escrita completa:

- Usuários para listagem e CRUD de gestão (`useUserStore`)
- Módulos (`modules`) por projeto
- Epics (`epics`) por módulo/projeto
- Dependências entre tarefas (`TaskDependency`)
- Comentários de tarefa
- Subtarefas
- Notificações
- Anotações (`TaskNote`)
- Anexos (`TaskAttachment`)
- Auditoria (`AuditLog`) e histórico de status (`StatusHistory`) como recursos persistidos

## Decisão aplicada para limpeza de mocks

- Removida a pasta `src/mocks/` e todos os arquivos de dados fake.
- Stores agora inicializam vazias.
- Dados de domínio cobertos por rota passam a ser carregados/salvos via API.
- Recursos sem rota permaneceram locais (estado em memória/persist), sem seed mock.

## Próximo passo para cobertura funcional de 100%

Para atingir 100% real (sem fallback local), o backend precisa expor os recursos faltantes acima.
Após isso, o frontend deve:

1. Trocar todos os métodos locais restantes por chamadas em `api`.
2. Remover persistência local de entidades de domínio.
3. Manter em localStorage apenas sessão/autenticação e preferências de UI.
