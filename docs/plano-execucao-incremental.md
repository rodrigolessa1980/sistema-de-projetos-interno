# Plano de execução incremental — Performance & Sincronização

> Complementa o [plano estratégico](./plano-performance-e-sincronizacao.md).
> Aqui cada item é um **incremento do tamanho de um PR**: pequeno, entregável sozinho,
> com arquivos exatos, mudança, critério de aceite e rollback. A ordem respeita as
> dependências — dá pra parar em qualquer ponto e o sistema continua funcionando.
>
> Legenda de esforço: **S** ≤ meio dia · **M** ~1–2 dias · **L** > 2 dias.
> Cada incremento fecha com `npm run build:check` (typecheck + build) verde.

---

## Visão geral (ordem e dependências)

```
FASE 0  perf base ───────────────────────────────────────────────
  INC-01 endpoint agregado de bootstrap ........ M   (nenhuma)
  INC-02 remover blobs do load inicial ......... S   (INC-01)
FASE 1  fidelidade do dado no front ────────────────────────────
  INC-03 reconcile.ts + dirtyIds ............... S   (nenhuma)
  INC-04 otimismo com id estável ............... S   (INC-03)
  INC-05 useMemo + mapas de lookup ............. M   (nenhuma)
  INC-06 acabar escrita dupla RQ+zustand ....... M   (INC-03)
  INC-07 estados de loading explícitos ......... M   (INC-03)
FASE 1b perf backend (paralelizável) ───────────────────────────
  INC-08 N+1 → updateMany / IN ................. S   (nenhuma)
  INC-09 tirar escrita do GET de tasks ......... S   (nenhuma)
  INC-10 índices compostos + pool .............. S   (nenhuma)
FASE 2  delta sync por timestamp ───────────────────────────────
  INC-11 migração updatedAt + change_log ....... M   (nenhuma)
  INC-12 GET /sync/changes + useDeltaSync ...... M   (INC-11, INC-03)
  INC-13 remover refetches totais pós-mutação .. S   (INC-12)
FASE 3  push near-real-time ─────────────────────────────────────
  INC-14 SSE (@Sse) reusando o delta ........... M   (INC-12)
```

Ganho rápido de percepção: **INC-01, INC-05, INC-08** já deixam o app visivelmente mais
rápido. Fidelidade: **INC-03/04/06/07**. "Ver o outro usuário": **INC-11→12**.

---

## FASE 0 — Performance base

### INC-01 · Endpoint agregado de bootstrap  · **M**
**Objetivo:** trocar `6N+5` requests do login por 2–3. É o maior ganho isolado.

**Backend**
- Novo `backend/src/infra/http/controllers/bootstrap.controller.ts`:
  ```ts
  @Controller('bootstrap')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  export class BootstrapController {
    constructor(private readonly prisma: PrismaService) {}

    @Get()
    @RequirePermission('projects:read')
    async load() {
      const [projects, companies, users] = await Promise.all([
        this.prisma.project.findMany({
          include: {
            developers: { select: { userId: true } },
            modules: { orderBy: { order: 'asc' } },
            epics: { include: { developers: { select: { userId: true } } } },
          },
        }),
        this.prisma.company.findMany(),
        this.prisma.user.findMany({
          select: { id: true, name: true, avatar: true, role: true, position: true, department: true, isActive: true, isApproved: true },
          orderBy: { createdAt: 'asc' },
        }),
      ]);
      return { projects, companies, users }; // tasks continuam por /tasks/project ou entram aqui numa 2ª fase
    }
  }
  ```
- Registrar em [http.module.ts](../backend/src/infra/http/http.module.ts) no array `controllers`.
- **Não** incluir anexos aqui (INC-02 garante isso). `modules`/`epics` sem os campos `Text`
  longos se possível (usar `select`).

**Frontend**
- Em [project-store.ts:133-176](../src/stores/project-store.ts#L133-L176), reescrever
  `fetchProjects` para 1 chamada a `bootstrap` + distribuir para as stores (projects,
  modules, epics, companies, users). Remover os 5 `Promise.all(projectIds.map(...))`.

**Aceite:** aba Network no login mostra ~2–3 requests (não 6N+5). Telas de lista carregam igual.
**Rollback:** manter `fetchProjects` antigo atrás de flag; reverter o controller.

---

### INC-02 · Remover blobs (`dataUrl`/`avatar`) do carregamento  · **S**
**Objetivo:** parar de trafegar base64 de anexos/avatars no load.

- Endpoints de anexo ([projects.controller.ts:185-193,222-230](../backend/src/infra/http/controllers/projects.controller.ts#L185-L193) e o de módulo): adicionar `select` só de metadados (`id, name, type, size, createdAt, userId, projectId/moduleId`) na listagem.
- Servir o binário por endpoint dedicado: `GET /attachments/:id/data` → retorna `dataUrl`.
- Front: anexos só são buscados ao **abrir** o detalhe (a store já tem
  `fetchProjectShowcaseAttachments` / `fetchModuleAttachmentsForProject`). Remover a busca
  em massa que ainda restar após INC-01.
- `listAll` de projeto e o bootstrap: `select` sem `avatar` (LongText) e sem descrições longas na lista.

**Aceite:** payload do bootstrap cai de MB para KB; abrir um anexo ainda funciona.
**Rollback:** remover o `select` (volta a mandar tudo).

---

## FASE 1 — Fidelidade do dado no front

### INC-03 · `reconcile.ts` + `dirtyIds` nas stores  · **S**
**Objetivo:** contrato único de merge por `updatedAt`, preservando edição local pendente.

- Criar `src/lib/reconcile.ts`:
  ```ts
  type Versioned = { id: string; updatedAt?: string };
  export function serverWins(local: Versioned | undefined, s: Versioned, dirty: Set<string>) {
    if (!local) return true;
    if (dirty.has(s.id)) return false;
    if (!local.updatedAt || !s.updatedAt) return true;
    return new Date(s.updatedAt) >= new Date(local.updatedAt);
  }
  export function mergeById<T extends Versioned>(cur: T[], inc: T[], dirty: Set<string>): T[] {
    const m = new Map(cur.map((x) => [x.id, x]));
    for (const s of inc) if (serverWins(m.get(s.id), s, dirty)) m.set(s.id, s);
    return [...m.values()];
  }
  ```
- Em `task-store` e `project-store`: adicionar `dirtyIds: Set<string>` (fora do estado
  persistido). Nas mutações otimistas, `dirtyIds.add(id)` no início e `.delete(id)` no
  `finally`/reconciliação.

**Aceite:** testes unitários de `serverWins`/`mergeById` (novo/mais novo/mais velho/sujo).
**Rollback:** helper isolado; não altera comportamento até ser usado.

---

### INC-04 · Otimismo com `id` estável (some o flicker de remonta)  · **S**
**Objetivo:** eliminar o "pisca" quando o id temporário vira o id do servidor.

- Gerar `uuid` no cliente e **enviar no POST** (backend já aceita `id` no create — ex.
  [prisma-task.repository.ts:49](../backend/src/infra/database/repositories/prisma-task.repository.ts#L49),
  [prisma-project.repository.ts:48](../backend/src/infra/database/repositories/prisma-project.repository.ts#L48)).
- Ajustar `createProject`/`createTask`/`createModule`/`createCompany` para inserir o
  registro otimista com o **mesmo id** e reconciliar com `mergeById` (sem trocar `key`).

**Aceite:** criar item não pisca/reordena; o registro final tem o id enviado.
**Rollback:** voltar a `generateId` + swap.

---

### INC-05 · `useMemo` + mapas de lookup nos hotspots  · **M**
**Objetivo:** matar recomputação O(n²) por render (obrigatório antes de ligar polling).

Aplicar mapa memoizado (`useMemo(() => new Map(xs.map(x=>[x.id,x])), [xs])`) e memoizar agregações:
- [dashboard/page.tsx:99-110,80-86](../src/app/dashboard/page.tsx#L99-L110) — `devRanking`, `periodHoursByProject`. **Desacoplar o tick de 1s** (isolar o cronômetro num componente próprio).
- [reports/overview/page.tsx:101-132,307-312](../src/app/reports/overview/page.tsx#L101-L132) — `dailyHours`, `statusDist`, `topTasks`, scans por user.
- [reports/daily/page.tsx:106,155-158](../src/app/reports/daily/page.tsx#L106) — `visibleLogs`, `dayTotals`.
- [projects/[id]/page.tsx:234-238,1187-1192,1446-1448](../src/app/projects/[id]/page.tsx#L234-L238) — `tasksByModule`, scans por módulo/dev.
- [gantt/page.tsx:216-218](../src/app/gantt/page.tsx#L216) e [projects/page.tsx:250-254](../src/app/projects/page.tsx#L250-L254) — trocar `find`/`filter` em JSX por mapa.

**Aceite:** React Profiler mostra render estável; dashboard não recalcula ranking a cada segundo.
**Rollback:** por página, independente.

---

### INC-06 · Acabar com a escrita dupla React Query + Zustand  · **M**
**Objetivo:** uma fonte de verdade → um render de correção (não dois).

- Decisão (plano estratégico, Parte 2.5): **Zustand como store única** (menor refactor).
- Em [use-tasks.ts](../src/hooks/use-tasks.ts): `useTasks`/`useTask` param de fazer
  `useQuery` **e** `setState`. Ou (a) viram thin wrappers que só chamam a store, ou (b)
  o `queryFn` hidrata a store via `mergeById` e os componentes leem **da query** (não das duas).
- Remover `invalidateQueries(["tasks"])` das mutações; a store já reflete o resultado
  (e o delta de INC-12 cobre o resto).

**Aceite:** mudar status de task provoca 1 atualização visual (sem refetch da lista inteira).
**Rollback:** reintroduzir os hooks antigos.

---

### INC-07 · Estados de loading explícitos  · **M**
**Objetivo:** não exibir dado velho "disfarçado de certo".

- Padronizar por recurso: `status: 'idle'|'loading'|'success'|'error'` + `isStale`.
- 1º load: skeleton (não o snapshot do `persist`).
- Refetch/poll sobre dado existente: manter tela + selo "atualizando" (sem apagar).
- `persist` do [task-store.ts:557-568](../src/stores/task-store.ts#L557-L568): restringir a
  rascunho local não-sincronizado; server-state sempre hidrata da API marcado `isStale` até confirmar.

**Aceite:** refresh mostra skeleton no 1º load; refetch não pisca a tela toda.
**Rollback:** manter flags de status sem trocar a UI.

---

## FASE 1b — Performance backend (paralelizável com a Fase 1)

### INC-08 · N+1 → `updateMany` / `IN`  · **S**
- [list-users.use-case.ts:26-33](../backend/src/core/use-cases/users/list-users.use-case.ts#L26-L33): trocar o loop de `findByUserId` por **um** `findMany({ where: { userId: { in: ids } } })` e agrupar em memória.
- [set-task-urgent.use-case.ts:35-51](../backend/src/core/use-cases/tasks/set-task-urgent.use-case.ts#L35-L51), [update-task.use-case.ts:86-103](../backend/src/core/use-cases/tasks/update-task.use-case.ts#L86-L103), [release-urgency-blocks.use-case.ts:16-21](../backend/src/core/use-cases/tasks/release-urgency-blocks.use-case.ts#L16-L21): trocar loops de `update` por `updateMany`.
- Anexos/epicDevelopers em loop ([prisma-module.repository.ts:243-256](../backend/src/infra/database/repositories/prisma-module.repository.ts#L243-L256), [prisma-epic.repository.ts:44-49](../backend/src/infra/database/repositories/prisma-epic.repository.ts#L44-L49)): `createMany`.

**Aceite:** listar usuários faz 2 queries (não 1+N); virar task urgente faz 1 `updateMany`.
**Rollback:** por use-case.

---

### INC-09 · Tirar escrita do caminho de leitura  · **S**
- [list-tasks-by-project.use-case.ts](../backend/src/core/use-cases/tasks/list-tasks-by-project.use-case.ts) não deve chamar `repairStaleBlocksInProject` (que faz `update` durante um GET).
- Mover o auto-reparo para o gancho de conclusão de blocker (já existe em `updateTask`) ou um job pontual.

**Aceite:** `GET /tasks/project/:id` não gera `UPDATE` no log do banco.
**Rollback:** restaurar a chamada.

---

### INC-10 · Índices compostos liderados por `tenantId` + pool  · **S**
- Em [schema.prisma](../backend/prisma/schema.prisma), trocar índices de coluna única por compostos onde a query filtra `tenantId AND x`:
  - `Task`: `@@index([tenantId, projectId])`, `@@index([tenantId, assigneeId])`, `@@index([tenantId, status])`
  - `TimeLog`: `@@index([tenantId, projectId, date])`, `@@index([tenantId, userId, date])`
  - `Module`/`Epic`: `@@index([tenantId, projectId])`
- Migração aditiva (só índices).
- [mysql.config.ts:64-73](../backend/src/infra/config/mysql.config.ts#L64-L73): definir `connectionLimit` (ex. 20–30).

**Aceite:** `EXPLAIN` das queries quentes usa o índice composto; migração aplica sem drift.
**Rollback:** `prisma migrate` de reversão (drop dos índices novos).

---

## FASE 2 — Delta sync por timestamp

### INC-11 · Migração `updatedAt` + `change_log`  · **M**
**Objetivo:** dar "carimbo de modificação" aos recursos sincronizados e rastrear exclusões.

- Adicionar `updatedAt DateTime @updatedAt` + `@@index([tenantId, updatedAt])` nos modelos que só têm `createdAt` e são sincronizados: **`TimeLog`** (crítico), `Notification`, `TaskDependency`, `*Attachment`, `StatusHistory`.
- Modelo `ChangeLog { id, tenantId, entity, entityId, action, at @default(now()) @@index([tenantId, at]) }`.
- Preencher via extensão/hook do Prisma nos `create/update/delete` (ou registrar nos use-cases de escrita). Reaproveitar o padrão da [tenant.extension.ts](../backend/src/infra/tenancy/tenant.extension.ts).

**Aceite:** editar um `TimeLog` muda seu `updatedAt`; excluir gera linha em `ChangeLog`.
**Rollback:** migração aditiva → reverter dropa colunas/tabela.

---

### INC-12 · `GET /sync/changes?since=` + `useDeltaSync`  · **M**
**Objetivo:** ver mudanças de outros usuários com custo baixo.

**Backend** — `SyncController`:
```ts
@Get('sync/changes')
@RequirePermission('projects:read')
async changes(@Query('since') since?: string) {
  const s = since ? new Date(since) : new Date(0);
  const [projects, tasks, timeLogs, deleted] = await Promise.all([
    this.prisma.project.findMany({ where: { updatedAt: { gt: s } } }),
    this.prisma.task.findMany({ where: { updatedAt: { gt: s } } }),
    this.prisma.timeLog.findMany({ where: { updatedAt: { gt: s } } }),
    this.prisma.changeLog.findMany({ where: { at: { gt: s }, action: 'DELETED' } }),
  ]);
  return { now: new Date().toISOString(), projects, tasks, timeLogs, deleted };
}
```
**Frontend** — `src/hooks/use-delta-sync.ts`:
```ts
export function useDeltaSync(enabled: boolean) {
  const since = useRef(new Date(0).toISOString());
  useQuery({
    queryKey: ['sync'], enabled,
    refetchOnWindowFocus: true,
    refetchInterval: () => (document.visibilityState === 'visible' ? 20_000 : false),
    queryFn: async () => {
      const d = await api.get<Delta>('sync/changes', { params: { since: since.current } });
      applyDeltaToStores(d);   // usa mergeById + dirtyIds (INC-03)
      since.current = d.now;
      return d;
    },
  });
}
```
- Montar `useDeltaSync(isAuthenticated && !isPending)` em [app-layout.tsx](../src/components/layout/app-layout.tsx) (junto do sync de work-session).

**Aceite:** usuário B cria/edita uma task; usuário A vê em ≤20s (ou ao focar a aba) sem recarregar; edição local em voo do A **não** é sobrescrita pelo poll.
**Rollback:** desmontar `useDeltaSync`.

---

### INC-13 · Remover refetches totais pós-mutação  · **S**
- [projects/[id]/page.tsx:307,350](../src/app/projects/[id]/page.tsx#L307): não chamar `loadReport()` após criar/excluir módulo — usar o retorno otimista; o delta cobre o restante.
- [activity-calendar.tsx:286,442](../src/components/shared/activity-calendar.tsx#L286): não chamar `fetchAllTimeLogs()` após salvar 1 entrada.

**Aceite:** criar módulo / salvar entrada não dispara re-download de datasets inteiros.
**Rollback:** por callsite.

---

## FASE 3 — Push near-real-time

### INC-14 · SSE (`@Sse`) reusando o delta  · **M**
**Objetivo:** tornar quase instantâneo sem polling constante.

- `EventEmitter` em processo, escopo por tenant; emitir `{ entity, id, action }` nos use-cases de escrita.
- `@Sse('sync/stream')` no NestJS devolve um `Observable<MessageEvent>` filtrado por `req.tenantId`.
- Front: `EventSource` recebe o "ping" e dispara o `?since=` só do que mudou. Polling de INC-12 vira **fallback** (aba/rede sem SSE).

**Aceite:** mudança de outro usuário aparece em ~1–2s sem intervalo fixo; queda do SSE cai no polling.
**Rollback:** desabilitar a rota SSE; polling continua funcionando sozinho.

---

## Checklist de conclusão por fase
- [ ] **Fase 0** — login faz ~2–3 requests; payload em KB.
- [ ] **Fase 1** — criar/editar não pisca; sem escrita dupla; loading explícito.
- [ ] **Fase 1b** — sem N+1 nos use-cases quentes; GET sem UPDATE; índices compostos.
- [ ] **Fase 2** — mudança de outro usuário visível em ≤20s sem clobber de edição local.
- [ ] **Fase 3** — near-real-time via SSE com fallback de polling.
