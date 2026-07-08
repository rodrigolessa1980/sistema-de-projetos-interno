# Plano — Performance, ciclo de vida do dado e sincronização multi-usuário

> 📋 **Execução passo a passo (PR a PR):** ver [plano de execução incremental](./plano-execucao-incremental.md).
> Este documento é o **porquê/estratégia**; o incremental é o **como/checklist**.

> Contexto: banco e app rodam no mesmo host (latência de rede desprezível). O custo
> relevante é **nº de round-trips**, **tamanho de payload** e **CPU redundante**
> (loops N+1 no back, recomputação no render). Este plano trata de **três coisas
> distintas mas acopladas**:
> 1. o *ciclo de vida do dado no front* (loading → render otimista/errado → resposta do back → render correto);
> 2. como manter os dados **minimamente fiéis** com `useMemo` + carimbo de modificação (`updatedAt`);
> 3. como ver **modificações de outros usuários** (polling vs alternativas).
>
> Pré-requisito recomendado: o **endpoint agregado de bootstrap** da auditoria anterior
> (`docs/` / conversa). Sem ele, qualquer polling multiplica a tempestade de requests.

---

## Parte 1 — Diagnóstico: o ciclo de vida atual do dado

Hoje o dado passa por até **3 renders** com valores diferentes numa única ação. Isso é
o "vejo a resposta errada e depois a certa". As causas concretas no código:

### 1.1. Fonte de verdade dupla (React Query + Zustand)
`useTasks` faz `useQuery` **e** grava na store: `useTaskStore.setState({ tasks })`
([use-tasks.ts:31-33](../src/hooks/use-tasks.ts#L31-L33)). O componente lê da store, mas
as mutações invalidam a query (`invalidateQueries(["tasks"])`,
[use-tasks.ts:69,108,124,140](../src/hooks/use-tasks.ts#L69)) → a query refaz o fetch →
regrava a store → novo render. Duas camadas de cache disputando a mesma verdade.

### 1.2. Otimismo com ID temporário → remonta o componente
`createCompany` cria `id: generateId("company")`, renderiza, depois troca pelo
registro do servidor ([project-store.ts:97-109](../src/stores/project-store.ts#L97-L109)).
Como o `id` muda, a `key` do React remonta o item → "pisca". Mesmo padrão em vários lugares.

### 1.3. Campos derivados calculados no cliente e sobrescritos pelo back
`appendTimeLog` recomputa `actualHours` somando no cliente
([task-store.ts:256-269](../src/stores/task-store.ts#L256-L269)); `updateEpic`/`reorderQueue`
setam `updatedAt: new Date().toISOString()` local
([project-store.ts:402-413,458-469](../src/stores/project-store.ts#L402-L413)). O back
depois responde com o valor autoritativo (às vezes diferente) → segundo valor na tela.

### 1.4. Zustand `persist` renderiza dado velho antes do fetch
`task-store` usa `persist` (localStorage) com `partialize` incluindo `tasks`
([task-store.ts:557-568](../src/stores/task-store.ts#L557-L568)). No refresh, a tela
mostra o snapshot velho do localStorage; depois o `fetchTasksForProjects` sobrescreve →
mais um salto visual (e risco de mostrar dado de outro estado).

### 1.5. Refetch total pós-mutação
Ex.: criar/excluir 1 módulo dispara `loadReport()` inteiro
([projects/[id]/page.tsx:307,350](../src/app/projects/[id]/page.tsx#L307)); salvar 1
entrada dispara `fetchAllTimeLogs()` (todos os logs do tenant)
([activity-calendar.tsx:286,442](../src/components/shared/activity-calendar.tsx#L286)).
Cada um é um novo ciclo loading→render.

**Resumo do problema:** não há um **contrato de reconciliação**. Cada store decide
sozinha quando confiar no otimismo e quando aceitar o servidor, sem versão/timestamp e
sem marcar o que está "sujo" (pendente de confirmação).

---

## Parte 2 — Estratégia: fidelidade com `updatedAt` + estado "sujo" + `useMemo`

Objetivo: **um render otimista instantâneo**, e depois **no máximo uma correção** — e só
quando o servidor realmente for mais novo. Nunca deixar um dado velho (poll lento)
sobrescrever uma edição fresca do próprio usuário.

### 2.1. Carimbo de modificação como token de versão (`updatedAt`)
Regra única de merge (last-write-wins por timestamp, respeitando edição local pendente):

```ts
// src/lib/reconcile.ts
type Versioned = { id: string; updatedAt?: string };

/** true = o registro do servidor deve substituir o local */
export function serverWins(local: Versioned | undefined, server: Versioned, dirtyIds: Set<string>): boolean {
  if (!local) return true;
  if (dirtyIds.has(server.id)) return false;            // edição local pendente: não clobber
  if (!local.updatedAt || !server.updatedAt) return true;
  return new Date(server.updatedAt) >= new Date(local.updatedAt);
}

/** merge de uma lista do servidor sobre a store, preservando itens sujos */
export function mergeById<T extends Versioned>(current: T[], incoming: T[], dirtyIds: Set<string>): T[] {
  const byId = new Map(current.map((x) => [x.id, x]));
  for (const s of incoming) {
    if (serverWins(byId.get(s.id), s, dirtyIds)) byId.set(s.id, s);
  }
  return Array.from(byId.values());
}
```

- Cada store ganha um `Set<string> dirtyIds` (ids com mutação em voo). Marca no início da
  mutação, remove no `onSettled`. Polls e refetches usam `mergeById` em vez de
  `setState({ tasks })` cru.
- **Elimina o clobber** do item 1.3/1.5 e o "render errado permanente" quando um poll
  chega no meio de uma edição.

### 2.2. Otimismo sem trocar `id` (some o flicker do 1.2)
- Gerar UUID no cliente **e mandar o mesmo id no POST** (o backend já aceita `id` no
  create — ver `create` nos repos, ex. [prisma-task.repository.ts:49](../backend/src/infra/database/repositories/prisma-task.repository.ts#L49)).
  Assim o registro otimista e o do servidor têm o **mesmo `id`** → sem remontar, sem piscar.
- Alternativa: manter `generateId` mas reconciliar por um `clientId` estável separado da `key`.

### 2.3. `useMemo` + mapas de lookup (mata a recomputação por render)
A auditoria anterior listou os hotspots. Padrão a aplicar:
- Trocar `array.find`/`array.filter` dentro de `.map` de JSX por **`Map` pré-construído**
  memoizado: `const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users])`.
- Memoizar agregações caras: `dashboard` `devRanking`
  ([dashboard/page.tsx:99-110](../src/app/dashboard/page.tsx#L99-L110)) e `reports/overview`
  ([reports/overview/page.tsx:108-114,307-312](../src/app/reports/overview/page.tsx#L108-L114)).
- **Desacoplar o tick de 1s** da recomputação: o `setInterval` do timer deve atualizar só
  o cronômetro (um componente isolado), não a árvore que recalcula rankings a cada segundo.
- Com polling ligado (Parte 3), memoizar é **obrigatório**: cada poll dispara render; sem
  memo, o custo O(n²) roda a cada intervalo.

### 2.4. Estados de carregamento explícitos (não "dado velho disfarçado de certo")
Padronizar por recurso: `status: "idle" | "loading" | "success" | "error"` + `isStale`.
- Primeiro load real: skeleton (não dado do localStorage).
- Refetch/poll em cima de dado existente: manter o dado na tela + indicador sutil de
  "atualizando" (não spinner que apaga a tela).
- `persist` do zustand: manter só para *rascunho local não sincronizado*; para dado de
  servidor, hidratar sempre da API e usar o cache só como placeholder marcado `isStale`.

### 2.5. Consolidar a fonte de verdade (decisão a tomar)
Duas opções — **recomendo a A** pelo tamanho do refactor:

| | A) Zustand como store única | B) React Query como cache de servidor |
|---|---|---|
| Server-state | fetch hidrata a store via `mergeById` | queries por recurso, store só p/ UI/otimismo |
| React Query | remover de `use-tasks`/`use-metrics` (ou usar só p/ fetch, sem regravar store) | vira a camada de cache; zustand só timer/UI |
| Esforço | menor (código já é zustand-cêntrico) | maior (reescrever telas p/ hooks de query) |
| Ganho | acaba a escrita dupla (1.1) | cache/stale/refetch/polling "de graça" |

Seja qual for, **acabar com "useQuery + setState na store ao mesmo tempo"** é o ponto.

---

## Parte 3 — Ver modificações de outros usuários: polling vs alternativas

Pergunta do usuário: "precisamos que o polling seja feito pra eu ver modificações de
outros usuários — não sei se polling é o ideal". Avaliação para o cenário real
(ferramenta interna, poucos usuários simultâneos por tenant, app+DB colocalizados):

### 3.1. Opções

**① Polling ingênuo (refetch total num intervalo)**
- `refetchInterval` do React Query re-puxando os datasets inteiros.
- ❌ Multiplica a tempestade de requests (6N+5) a cada intervalo. **Não usar** enquanto o
  bootstrap não for agregado; mesmo depois, re-puxa tudo à toa.

**② Delta polling (`?since=<timestamp>`) — recomendado curto prazo**
- Endpoint leve que retorna só o que mudou: `GET /sync/changes?since=<ISO>` →
  `{ now, projects:[…], tasks:[…], timeLogs:[…], deleted:{ tasks:[ids] } }`, filtrando
  `where: { updatedAt: { gt: since } }` (tenant já isolado pela extensão).
- Cliente guarda o último `now`, faz merge com `mergeById` (Parte 2.1).
- ✅ Barato (aproveita índices e `updatedAt`), simples, HTTP puro, sem infra nova.
- ✅ Casa com o que já existe: intervalo + **refetch no foco da aba** (padrão já usado em
  [use-work-session.ts:155-162](../src/hooks/use-work-session.ts#L155-L162)).
- Intervalo sugerido: **15–30s** com o app em foco; pausar quando a aba está oculta.

**③ SSE (Server-Sent Events) — ideal médio prazo**
- NestJS tem `@Sse()` nativo (server→client, unidirecional, sobre HTTP). Um
  `EventEmitter` em processo, escopo por tenant, emite `{ entity, id, action }` quando algo
  muda; o cliente recebe o "ping" e busca **o delta** (`?since=`) só do que mudou.
- ✅ Quase instantâneo, sem ficar batendo no servidor à toa; infra mínima (1 processo,
  colocalizado). Ideal para "ver a mudança do outro na hora".
- ⚠️ Cuidado com limite de conexões concorrentes por navegador em HTTP/1.1 (1 stream por
  aba já resolve); reconexão automática o browser faz sozinho.

**④ WebSocket (full duplex)**
- ❌ Overkill aqui: o fluxo é majoritariamente server→client (avisar que mudou). Só
  compensaria com colaboração ao vivo bidirecional (cursor/edição simultânea), que não é o caso.

### 3.2. Recomendação
1. **Agora:** implementar **delta polling `?since=`** (opção ②) + refetch no foco + pausa
   em aba oculta. Resolve "ver o que o outro fez" com baixo risco e reaproveita `updatedAt`.
2. **Depois:** subir para **SSE** (opção ③) reusando os mesmos endpoints de delta — o SSE
   só troca o "quando buscar" (push em vez de timer). Migração incremental, sem reescrever o merge.
3. **Não** ir para WebSocket sem um caso de colaboração ao vivo real.

### 3.3. Pré-requisitos de schema (carimbo de modificação onde falta)
Para delta/SSE funcionarem, todo recurso sincronizado precisa de `updatedAt` indexado:

- **Já têm `updatedAt`:** Tenant, Company, User, Project, Module, Epic, Task, Subtask,
  Comment, TaskNote, UserPermission.
- **Faltam (só `createdAt`) e são sincronizados:** **`TimeLog`** (crítico — é editado),
  `Notification`, `TaskDependency`, anexos (`*Attachment`), `StatusHistory`.
- **Sem timestamp:** join tables `ProjectDeveloper`/`EpicDeveloper` (mudança rara → sincronizar
  via `updatedAt` do projeto/épico pai, ou adicionar `updatedAt`).

Ações:
- Adicionar `updatedAt DateTime @updatedAt` + `@@index([tenantId, updatedAt])` nos modelos
  sincronizados que faltam (migração aditiva, sem drift — mesma técnica da migração multi-tenant).
- **Delete tracking:** delta polling não vê exclusões. Opções: (a) soft-delete
  (`deletedAt`), ou (b) uma tabela `change_log(tenantId, entity, entityId, action, at)`
  preenchida por hook do Prisma; o `?since=` retorna também os `deleted`. Recomendo (b) por
  ser localizado e não mexer nas queries existentes.

---

## Parte 4 — Roadmap por fases

Ordenado por (impacto ÷ esforço). Cada fase entrega valor sozinha.

### Fase 0 — Pré-requisito (da auditoria de performance)
- [ ] Endpoint agregado de bootstrap (projetos+módulos+épicos+tasks numa query).
- [ ] Tirar blobs (`dataUrl`/`avatar`) do load inicial; `select` de metadados.
- **Sem isto, polling piora tudo.**

### Fase 1 — Fidelidade do dado (front, sem backend novo)
- [ ] `src/lib/reconcile.ts` (`mergeById` + `serverWins`) e `dirtyIds` nas stores.
- [ ] Otimismo com `id` estável (mandar UUID no POST) → some o flicker de remonta.
- [ ] Parar de sobrescrever a store com `setState` cru; usar `mergeById`.
- [ ] `useMemo` + mapas de lookup nos hotspots (dashboard, overview, projects, gantt).
- [ ] Desacoplar o tick de 1s da recomputação pesada.
- [ ] Resolver fonte de verdade dupla (opção A da Parte 2.5): parar `useQuery`+`setState` simultâneos.
- [ ] Estados de loading explícitos (skeleton no 1º load; "atualizando" no refetch).

### Fase 2 — Delta sync por timestamp (backend + front)
- [ ] Migração: `updatedAt` + `@@index([tenantId, updatedAt])` nos modelos que faltam (TimeLog etc.).
- [ ] Tabela/hook `change_log` para exclusões.
- [ ] `GET /sync/changes?since=` (tenant-scoped) retornando alterados + deletados + `now`.
- [ ] Hook `useDeltaSync` (React Query `refetchInterval` 15–30s + refetch no foco + pausa em aba oculta) aplicando `mergeById`.
- [ ] Remover os refetches totais pós-mutação (usar o retorno otimista + o delta cobre o resto).

### Fase 3 — Push near-real-time (SSE)
- [ ] `EventEmitter` por tenant + `@Sse('/sync/stream')` no NestJS.
- [ ] Emitir evento nos use-cases de escrita (create/update/delete) com `{ entity, id, action }`.
- [ ] Front: `EventSource` dispara o `?since=` só do que mudou; polling vira fallback (aba sem SSE).

---

## Apêndice — Esboços de referência

**Endpoint de delta (NestJS):**
```ts
@Get('sync/changes')
@RequirePermission('projects:read')
async changes(@Query('since') since: string) {
  const s = since ? new Date(since) : new Date(0);
  const [projects, tasks, timeLogs, deleted] = await Promise.all([
    this.prisma.project.findMany({ where: { updatedAt: { gt: s } } }),
    this.prisma.task.findMany({ where: { updatedAt: { gt: s } } }),
    this.prisma.timeLog.findMany({ where: { updatedAt: { gt: s } } }), // requer updatedAt
    this.prisma.changeLog.findMany({ where: { action: 'DELETED', at: { gt: s } } }),
  ]);
  return { now: new Date().toISOString(), projects, tasks, timeLogs, deleted };
}
```

**Hook de delta (front):**
```ts
export function useDeltaSync(enabled: boolean) {
  const since = useRef<string>(new Date(0).toISOString());
  useQuery({
    queryKey: ['sync'],
    enabled,
    refetchInterval: (q) => (document.visibilityState === 'visible' ? 20_000 : false),
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const d = await api.get<Delta>('sync/changes', { params: { since: since.current } });
      applyDeltaToStores(d);      // usa mergeById + dirtyIds
      since.current = d.now;
      return d;
    },
  });
}
```

**SSE (evolução da Fase 3):**
```ts
@Sse('sync/stream')
stream(@Req() req: AuthenticatedRequest): Observable<MessageEvent> {
  return this.bus.forTenant(req.tenantId); // EventEmitter -> Observable, escopo por tenant
}
```
