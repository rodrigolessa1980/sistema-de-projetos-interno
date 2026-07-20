import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';
import { tenantExtension } from '../infra/tenancy/tenant.extension';
import { TenantContext } from '../infra/tenancy/tenant-context';
import { TENANT_IDS } from '../infra/tenancy/tenant.constants';
import { ModuleStatus, TaskStatus } from '../core/domain/entities/enums';
import { deriveModuleStatus, deriveProjectProgress } from '../core/domain/services/derive-hierarchy';

/**
 * Reconcilia dados legados importados que ficaram inconsistentes:
 *
 *  1) Tarefas CONCLUÍDA sem `completedAt` -> preenche a data de conclusão
 *     (e o `startDate`, se ausente) usando a melhor proxy disponível:
 *     workDate do módulo -> dueDate -> startDate -> updatedAt.
 *     Isso conserta o Gantt (a barra deixava de "terminar") e os tooltips.
 *
 *  2) Módulos cujas tarefas estão TODAS concluídas mas o próprio módulo
 *     continua INICIADO/EM_PROCESSO -> marca CONCLUIDO / progress 100.
 *
 *  Opcional (WITH_PROJECTS=1): realinha `project.progress` ao derivado dos
 *  módulos (média), evitando que o card do projeto fique defasado após (2).
 *
 * Segurança:
 *  - DRY-RUN por padrão. Só grava com APPLY=1 (ou APPLY=true).
 *  - Idempotente: só toca tarefas com completedAt nulo e módulos != CONCLUIDO,
 *    então rodar de novo é no-op.
 *  - Roda isolado por tenant (Desenvolvimento e Marketing), via a extensão de
 *    tenancy (que também esconde registros soft-deleted).
 */

const APPLY = process.env.APPLY === '1' || process.env.APPLY === 'true';
const WITH_PROJECTS = process.env.WITH_PROJECTS === '1' || process.env.WITH_PROJECTS === 'true';

function ymd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface TenantTotals {
  tasks: number;
  modules: number;
  projects: number;
}

async function reconcileTenant(prisma: PrismaClient): Promise<TenantTotals> {
  const totals: TenantTotals = { tasks: 0, modules: 0, projects: 0 };

  // ── Fase 1: tarefas CONCLUÍDA sem completedAt ──────────────────────────────
  const brokenTasks = await prisma.task.findMany({
    where: { status: TaskStatus.CONCLUIDA, completedAt: null },
    select: {
      id: true,
      title: true,
      moduleId: true,
      startDate: true,
      dueDate: true,
      updatedAt: true,
    },
  });

  const moduleIds = [...new Set(brokenTasks.map((t) => t.moduleId))];
  const workDateById = new Map<string, Date | null>();
  if (moduleIds.length) {
    const mods = await prisma.module.findMany({
      where: { id: { in: moduleIds } },
      select: { id: true, workDate: true },
    });
    for (const m of mods) workDateById.set(m.id, m.workDate);
  }

  console.log(`\n[Tarefas] ${brokenTasks.length} CONCLUÍDA(s) sem data de conclusão`);
  for (const t of brokenTasks) {
    const eff = workDateById.get(t.moduleId) ?? t.dueDate ?? t.startDate ?? t.updatedAt;
    const fillStart = t.startDate == null;
    console.log(
      `  - "${t.title.slice(0, 60)}"  ->  completedAt=${ymd(eff)}` +
        (fillStart ? `, startDate=${ymd(eff)}` : ''),
    );
    if (APPLY) {
      await prisma.task.update({
        where: { id: t.id },
        data: { completedAt: eff, ...(fillStart ? { startDate: eff } : {}) },
      });
    }
    totals.tasks += 1;
  }

  // ── Fase 2: módulos com todas as tarefas concluídas mas status != CONCLUIDO ─
  const activeModules = await prisma.module.findMany({
    where: { status: { not: ModuleStatus.CONCLUIDO } },
    select: { id: true, name: true, projectId: true, status: true, progress: true },
  });
  const allTasks = await prisma.task.findMany({ select: { moduleId: true, status: true } });

  const statusesByModule = new Map<string, string[]>();
  for (const t of allTasks) {
    const arr = statusesByModule.get(t.moduleId);
    if (arr) arr.push(t.status);
    else statusesByModule.set(t.moduleId, [t.status]);
  }

  // Mesma regra canônica do app: CANCELADA não bloqueia a conclusão.
  const toComplete = activeModules.filter(
    (m) => deriveModuleStatus((statusesByModule.get(m.id) ?? []) as TaskStatus[]) === ModuleStatus.CONCLUIDO,
  );
  const completedIds = new Set(toComplete.map((m) => m.id));

  console.log(`\n[Módulos] ${toComplete.length} com todas as tarefas concluídas mas ainda não CONCLUIDO`);
  for (const m of toComplete) {
    console.log(`  - "${m.name.slice(0, 60)}" (${m.status}/${m.progress}%)  ->  CONCLUIDO/100%`);
    if (APPLY) {
      await prisma.module.update({
        where: { id: m.id },
        data: { status: ModuleStatus.CONCLUIDO, progress: 100 },
      });
    }
    totals.modules += 1;
  }

  // ── Fase 3 (opcional): realinhar progresso dos projetos afetados ───────────
  const affectedProjects = [...new Set(toComplete.map((m) => m.projectId))];
  if (affectedProjects.length) {
    console.log(
      `\n[Projetos] ${affectedProjects.length} projeto(s) com módulos alterados` +
        (WITH_PROJECTS ? ' — realinhando progresso' : ' — progresso derivado defasado (use WITH_PROJECTS=1 p/ alinhar)'),
    );
    for (const projectId of affectedProjects) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, name: true, progress: true },
      });
      if (!project) continue;
      const mods = await prisma.module.findMany({
        where: { projectId },
        select: {
          id: true,
          progress: true,
          _count: { select: { tasks: { where: { deletedAt: null } } } },
        },
      });
      // Progresso projetado (regra canônica ponderada por nº de tarefas): os
      // módulos que serão marcados agora contam como 100.
      const projected = deriveProjectProgress(
        mods.map((m) => ({
          progress: completedIds.has(m.id) ? 100 : m.progress,
          taskCount: m._count.tasks,
        })),
      );
      const drift = projected !== project.progress;
      console.log(
        `  - "${project.name.slice(0, 50)}": armazenado=${project.progress}% derivado=${projected}%` +
          (drift ? '  <-- defasado' : ''),
      );
      if (WITH_PROJECTS && APPLY && drift) {
        await prisma.project.update({ where: { id: projectId }, data: { progress: projected } });
        totals.projects += 1;
      }
    }
  }

  return totals;
}

async function run() {
  const base = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  const prisma = base.$extends(tenantExtension) as unknown as PrismaClient;

  console.log(
    APPLY
      ? '\n*** MODO APPLY — GRAVANDO NA PRODUÇÃO ***'
      : '\n*** DRY-RUN — nada será gravado (defina APPLY=1 para gravar) ***',
  );
  console.log(WITH_PROJECTS ? '(WITH_PROJECTS=1: progresso dos projetos será realinhado)\n' : '');

  const grand: TenantTotals = { tasks: 0, modules: 0, projects: 0 };
  for (const [label, tenantId] of Object.entries(TENANT_IDS)) {
    await TenantContext.run(tenantId, async () => {
      console.log(`\n===================== Tenant: ${label} =====================`);
      const t = await reconcileTenant(prisma);
      grand.tasks += t.tasks;
      grand.modules += t.modules;
      grand.projects += t.projects;
    });
  }

  console.log('\n================================================================');
  console.log(
    `Resumo ${APPLY ? '(gravado)' : '(dry-run)'}: ` +
      `${grand.tasks} tarefa(s), ${grand.modules} módulo(s)` +
      (WITH_PROJECTS ? `, ${grand.projects} projeto(s)` : ''),
  );
  if (!APPLY) console.log('Nada foi gravado. Reveja o plano acima e rode com APPLY=1 para aplicar.');

  await base.$disconnect();
}

run().catch((e) => {
  console.error('Erro:', e instanceof Error ? e.message : e);
  process.exit(1);
});
