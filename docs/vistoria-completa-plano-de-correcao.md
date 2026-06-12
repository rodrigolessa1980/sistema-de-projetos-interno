# Vistoria Completa e Plano de Correcao

Data da vistoria: 2026-06-05

## 1. Resumo Executivo

O sistema ja esta autenticando corretamente entre frontend e backend. O erro de CORS foi corrigido e o login passou nos testes E2E. O problema principal agora e que o frontend nao esta recebendo dados completos para varias telas, principalmente porque o banco/API atualmente tem usuarios, empresas e projetos, mas nao tem modulos, epics, tarefas, notificacoes e fila populada.

Estado observado:

- Frontend React + Vite em `http://localhost:8022`.
- Backend NestJS em `http://localhost:4011/api`.
- Login admin funcionando.
- API respondendo para usuarios, empresas e projetos.
- Build do frontend passa.
- Backend E2E passa apenas para `/api/health`.
- Lint do frontend falha em `src/app/users/page.tsx`.
- Playwright frontend passa login, mas falha em fluxos que dependem de notificacoes, Kanban, epics e tarefas.

Dados encontrados via API:

- Usuarios: 9.
- Empresas: 6.
- Projetos: 8.
- Projetos na fila: 0.
- Modulos: 0.
- Epics: 0.
- Tarefas: 0.

## 2. Prioridade Geral

Ordem recomendada de execucao:

1. Criar seed completo com modulos, epics, tarefas, fila e notificacoes.
2. Fazer o frontend carregar tarefas globais ao entrar no sistema.
3. Corrigir telas de modulos e epics para criar e exibir dados reais.
4. Popular e corrigir fila de desenvolvimento.
5. Persistir e carregar notificacoes pelo backend.
6. Validar timesheet com tarefas reais.
7. Corrigir lint e warnings principais.
8. Reescrever testes E2E usando dados reais criados via API.

## 3. Login e Autenticacao

Status atual:

- Login via `POST /api/auth/login` funciona.
- `GET /api/auth/me` funciona com token JWT.
- CORS esta liberando `http://localhost:8022`.
- Sessao e salva no `localStorage` pelo frontend.

O que ainda precisa ser feito:

1. Testar login invalido e mostrar mensagem clara no frontend.
2. Testar token expirado e redirecionamento para `/login`.
3. Testar logout limpando sessao.
4. Testar permissao de admin e developer em telas protegidas.

Arquivos principais:

- `backend/src/infra/http/controllers/auth.controller.ts`
- `src/lib/auth.ts`
- `src/stores/auth-store.ts`
- `src/hooks/use-auth.ts`
- `src/app/login/page.tsx`

## 4. Carregamento Global de Dados no Frontend

Status atual:

- `AppLayout` carrega projetos e usuarios.
- `AppLayout` nao carrega tarefas.
- Varias telas dependem de `useTaskStore`, que fica vazio quando nenhuma pagina especifica carregou tarefas.

Impacto:

- Dashboard fica com metricas zeradas/incompletas.
- Kanban fica sem cards.
- Lista de tarefas fica vazia.
- Relatorios e metricas ficam sem base real.
- Notificacoes de prazo vencido nao aparecem.

O que precisa ser feito:

1. Criar um metodo no `useTaskStore` para buscar tarefas de todos os projetos.
2. Apos `fetchProjects()`, buscar tarefas de cada projeto via `GET /tasks/project/:projectId`.
3. Popular `task-store` com o resultado consolidado.
4. Garantir que Dashboard, Tarefas, Kanban, Metricas e Relatorios usem dados carregados.
5. Tratar loading e erro nas telas que dependem de tarefas.

Arquivos principais:

- `src/components/layout/app-layout.tsx`
- `src/stores/task-store.ts`
- `src/stores/project-store.ts`
- `src/hooks/use-tasks.ts`

## 5. Seed e Dados Iniciais

Status atual:

- Seed atual cria usuarios e empresas.
- Nao cria projetos completos com modulos, epics, tarefas, notificacoes e time logs.
- Os testes E2E esperam dados antigos como `task-2`, `task-4`, `Plataforma E-commerce` e `Carrinho`, mas esses dados nao existem no banco atual.

O que precisa ser feito:

1. Atualizar `backend/prisma/seed.ts`.
2. Criar projetos com `queueOrder`.
3. Criar modulos para cada projeto.
4. Criar epics para cada modulo.
5. Criar tarefas em todos os status:
   - `BACKLOG`
   - `PLANEJADA`
   - `BLOQUEADA`
   - `EM_DESENVOLVIMENTO`
   - `EM_REVISAO`
   - `HOMOLOGACAO`
   - `CONCLUIDA`
   - `CANCELADA`
6. Criar tarefas atribuidas a desenvolvedores.
7. Criar tarefas vencidas para testar alertas.
8. Criar tarefas urgentes para testar bloqueio por urgencia.
9. Criar registros de horas para alimentar dashboard e relatorios.
10. Criar notificacoes para admin e developer.

Arquivo principal:

- `backend/prisma/seed.ts`

## 6. Empresas

Status atual:

- API retorna empresas.
- Frontend consegue listar empresas.
- Store possui operacoes otimistas de criar, atualizar e deletar.

Riscos encontrados:

- Operacoes otimistas podem esconder erro real da API.
- Precisa validar se criacao/edicao/delecao realmente persistem apos reload.

O que precisa ser testado:

1. Criar empresa.
2. Editar nome, sigla, cor e CNPJ.
3. Deletar empresa sem projeto vinculado.
4. Tentar deletar empresa com projeto vinculado.
5. Recarregar pagina e confirmar persistencia.

Arquivos principais:

- `src/app/companies/page.tsx`
- `src/stores/project-store.ts`
- `backend/src/infra/http/controllers/companies.controller.ts`

## 7. Projetos

Status atual:

- API retorna 8 projetos.
- Frontend lista projetos.
- Alguns projetos nao tem `companyId`.
- A fila retorna 0 porque `queueOrder` nao esta populado.

O que precisa ser feito:

1. Garantir que projetos tenham empresa quando necessario.
2. Garantir que projetos tenham dono (`ownerId`) valido.
3. Garantir que projetos tenham desenvolvedores associados.
4. Definir regra clara para `queueOrder`.
5. Testar criacao, edicao e exclusao.
6. Testar tela de detalhe do projeto.

Arquivos principais:

- `src/app/projects/page.tsx`
- `src/app/projects/[id]/page.tsx`
- `src/stores/project-store.ts`
- `backend/src/infra/http/controllers/projects.controller.ts`

## 8. Fila de Desenvolvimento

Status atual:

- `GET /projects/queued` retorna 0.
- A tela de fila depende de projetos com `queueOrder != null`.

Problema:

- Existem projetos, mas nenhum aparece na fila.

O que precisa ser feito:

1. Popular `queueOrder` no seed.
2. Decidir se projetos `ATIVO` sem `queueOrder` devem aparecer automaticamente ou nao.
3. Testar drag and drop da fila.
4. Testar botao de mover para o topo.
5. Confirmar persistencia apos reload.

Arquivos principais:

- `src/app/queue/page.tsx`
- `src/stores/project-store.ts`
- `backend/src/infra/http/controllers/projects.controller.ts`

## 9. Modulos

Status atual:

- API possui rotas para listar e criar modulos.
- Banco retorna 0 modulos.
- Tela de modulos apenas exibe; nao tem acao para criar modulo.
- O arquivo importa `Plus` e `useState`, mas nao usa.

O que precisa ser feito:

1. Criar modulos no seed.
2. Adicionar botao `Novo Modulo`.
3. Criar dialog/form para modulo.
4. Persistir modulo via `POST /modules`.
5. Recarregar pagina e confirmar persistencia.
6. Mostrar modulos agrupados por projeto.

Arquivos principais:

- `src/app/modules/page.tsx`
- `src/stores/project-store.ts`
- `backend/src/infra/http/controllers/modules.controller.ts`

## 10. Epics

Status atual:

- API possui rotas para listar e criar epics.
- Banco retorna 0 epics.
- Tela de epics depende de projetos e modulos.
- Sem modulos, a criacao de epic fica bloqueada na pratica.

O que precisa ser feito:

1. Criar epics no seed.
2. Garantir que cada epic esteja ligado a projeto e modulo validos.
3. Testar botao `Novo Epic`.
4. Testar criacao com desenvolvedores.
5. Validar progresso do epic com base nas tarefas.
6. Ajustar E2E para usar dados reais ou criar projeto/modulo/epic antes do teste.

Arquivos principais:

- `src/app/epics/page.tsx`
- `src/stores/project-store.ts`
- `backend/src/infra/http/controllers/modules.controller.ts`

## 11. Tarefas

Status atual:

- API possui rotas para criar, listar por projeto, buscar por ID, atualizar, deletar, marcar urgente e reordenar Kanban.
- Banco retorna 0 tarefas.
- Frontend depende de `task-store`, mas tarefas nao sao carregadas globalmente.

O que precisa ser feito:

1. Criar tarefas no seed.
2. Criar carregamento global de tarefas.
3. Testar tela `/tasks`.
4. Testar filtro por status.
5. Testar filtro por projeto.
6. Testar busca por texto.
7. Testar criacao de tarefa.
8. Testar edicao de tarefa.
9. Testar exclusao de tarefa.
10. Testar detalhes da tarefa.
11. Testar tarefa urgente.
12. Testar bloqueios.

Arquivos principais:

- `src/app/tasks/page.tsx`
- `src/app/tasks/[id]/page.tsx`
- `src/features/tasks/task-create-dialog.tsx`
- `src/stores/task-store.ts`
- `backend/src/infra/http/controllers/tasks.controller.ts`

## 12. Kanban

Status atual:

- Tela tem colunas e drag and drop implementado.
- E2E falha porque nao encontra cards/tarefas.
- Teste usa IDs fixos antigos, como `task-2`.

O que precisa ser feito:

1. Garantir carregamento de tarefas antes da renderizacao.
2. Popular tarefas em todos os status.
3. Ajustar E2E para procurar tarefas por titulo ou criar dados via API.
4. Testar mover tarefa entre colunas.
5. Testar persistencia apos reload.
6. Testar regra de bloqueio por dependencia.
7. Testar regra de urgencia.

Arquivos principais:

- `src/app/kanban/page.tsx`
- `src/hooks/use-tasks.ts`
- `src/stores/task-store.ts`
- `backend/src/infra/http/controllers/tasks.controller.ts`

## 13. Dashboard e Metricas

Status atual:

- Dashboard compila.
- Metricas sao calculadas com base em `projects`, `tasks` e `timeLogs`.
- Como nao ha tarefas/time logs carregados, numeros ficam zerados ou incompletos.

O que precisa ser feito:

1. Carregar tarefas globalmente.
2. Carregar time logs ou buscar por usuario/projeto.
3. Criar dados de horas no seed.
4. Validar cards:
   - projetos ativos
   - tarefas abertas
   - concluidas
   - atrasadas
   - bloqueadas
5. Validar graficos com dados reais.
6. Revisar se metricas devem vir calculadas do backend ou continuar no frontend.

Arquivos principais:

- `src/app/dashboard/page.tsx`
- `src/hooks/use-metrics.ts`
- `src/stores/task-store.ts`

## 14. Time Logs e Cronometro

Status atual:

- Backend tem rotas para criar, deletar, listar por task/user, sessao ativa, start e stop.
- Sem tarefas reais, nao da para validar o fluxo completo no frontend.

O que precisa ser feito:

1. Criar tarefas reais.
2. Testar apontamento manual de horas.
3. Testar iniciar cronometro.
4. Testar parar cronometro.
5. Confirmar atualizacao no Dashboard.
6. Confirmar atualizacao em Relatorios de Horas.
7. Validar bloqueio de sessoes paralelas.

Arquivos principais:

- `src/app/time-logs/page.tsx`
- `src/components/shared/work-timer.tsx`
- `src/hooks/use-work-session.ts`
- `src/stores/work-session-store.ts`
- `backend/src/infra/http/controllers/time-logs.controller.ts`

## 15. Notificacoes

Status atual:

- Notificacoes existem apenas no Zustand local.
- Nao ha fetch de notificacoes do backend.
- Playwright espera textos que nao existem no estado atual.

O que precisa ser feito:

1. Criar model/use case/controller para notificacoes ou expor rotas existentes se ja houver schema.
2. Criar `GET /notifications`.
3. Criar `PATCH /notifications/:id/read`.
4. Criar `PATCH /notifications/read-all`.
5. Popular notificacoes no seed.
6. Carregar notificacoes no `Header` ou `AppLayout`.
7. Atualizar E2E para validar admin e developer.

Arquivos principais:

- `src/components/layout/header.tsx`
- `src/stores/ui-store.ts`
- `backend/prisma/schema.prisma`

## 16. Usuarios e Permissoes

Status atual:

- API retorna usuarios.
- Tela de usuarios existe.
- Lint falha nessa tela por uso de `setState` dentro de `useEffect`.

O que precisa ser feito:

1. Corrigir `src/app/users/page.tsx`.
2. Testar listagem.
3. Testar criacao de usuario.
4. Testar alteracao de permissoes.
5. Testar diferenca entre admin e developer.
6. Confirmar persistencia apos reload.

Arquivo principal:

- `src/app/users/page.tsx`
- `src/features/users/user-dialog.tsx`
- `backend/src/infra/http/controllers/users.controller.ts`

## 17. Relatorios

Status atual:

- Paginas existem.
- Dados dependem de projetos, tarefas e time logs.
- Sem tarefas/time logs, relatorios ficam incompletos.

O que precisa ser feito:

1. Alimentar tarefas.
2. Alimentar time logs.
3. Validar relatorio geral.
4. Validar relatorio de horas.
5. Validar produtividade.
6. Validar relatorio de projetos.
7. Adicionar testes de renderizacao basica.

Arquivos principais:

- `src/app/reports/overview/page.tsx`
- `src/app/reports/hours/page.tsx`
- `src/app/reports/productivity/page.tsx`
- `src/app/reports/projects/page.tsx`

## 18. Lint e Qualidade de Codigo

Status atual:

- `npm run lint` falha.
- Existem 2 erros e muitos warnings.
- Erros principais em `src/app/users/page.tsx`.

O que precisa ser feito:

1. Corrigir `setState` dentro de `useEffect`.
2. Corrigir dependencias faltantes em hooks.
3. Remover imports nao usados.
4. Trocar `form.watch` por `useWatch` onde necessario.
5. Rodar `npm run lint` ate ficar verde.

Arquivos com maior impacto:

- `src/app/users/page.tsx`
- `src/app/companies/page.tsx`
- `src/app/projects/page.tsx`
- `src/features/tasks/task-create-dialog.tsx`

## 19. Testes

Status atual:

- Frontend build passa.
- Frontend lint falha.
- `npm test` frontend falha porque Vitest tenta executar Playwright em `e2e/internal-flow.spec.ts`.
- Backend unitario nao tem testes.
- Backend E2E testa apenas health.
- Playwright ainda depende de dados antigos/fixos.

O que precisa ser feito:

1. Configurar Vitest para ignorar `e2e/**`.
2. Criar testes unitarios ou ajustar script para nao falhar sem testes.
3. Expandir backend E2E:
   - auth
   - users
   - companies
   - projects
   - modules
   - epics
   - tasks
   - time logs
4. Reescrever Playwright para criar dados antes do teste.
5. Evitar IDs fixos como `task-2`.
6. Testar fluxos reais:
   - login admin
   - login developer
   - empresas
   - projetos
   - modulos
   - epics
   - tarefas
   - Kanban
   - fila
   - time tracker
   - relatorios
   - permissoes

Arquivos principais:

- `playwright.config.ts`
- `e2e/internal-flow.spec.ts`
- `backend/test/app.e2e-spec.ts`
- `package.json`

## 20. Checklist de Execucao

### Etapa 1: Base de dados

- [ ] Atualizar seed completo.
- [ ] Rodar migrations.
- [ ] Rodar seed.
- [ ] Confirmar via API contagens de modulos, epics e tarefas.

### Etapa 2: Carregamento no frontend

- [ ] Buscar tarefas de todos os projetos no login/layout.
- [ ] Buscar time logs necessarios.
- [ ] Buscar notificacoes.
- [ ] Validar refresh de pagina.

### Etapa 3: Telas principais

- [ ] Dashboard.
- [ ] Empresas.
- [ ] Projetos.
- [ ] Modulos.
- [ ] Epics.
- [ ] Tarefas.
- [ ] Kanban.
- [ ] Fila.
- [ ] Time logs.
- [ ] Metricas.
- [ ] Relatorios.
- [ ] Usuarios.

### Etapa 4: Qualidade

- [ ] Corrigir lint.
- [ ] Corrigir testes frontend.
- [ ] Expandir testes backend.
- [ ] Reescrever Playwright.

## 21. Criterio Para Considerar Resolvido

O sistema pode ser considerado em bom estado quando:

- Login admin e developer funcionam.
- Todas as telas carregam dados reais apos refresh.
- Dashboard mostra metricas coerentes.
- Kanban mostra tarefas e persiste movimentacao.
- Fila mostra projetos ordenados e persiste reordenacao.
- Modulos e epics podem ser criados pelo frontend.
- Tarefas podem ser criadas, editadas, movidas e excluidas.
- Time logs aparecem em dashboard e relatorios.
- Notificacoes aparecem por usuario.
- `npm run build` passa.
- `npm run lint` passa.
- `npm test` nao executa Playwright indevidamente.
- `npm run test:e2e` do backend cobre mais que health.
- `npx playwright test` passa com dados criados/controlados.
