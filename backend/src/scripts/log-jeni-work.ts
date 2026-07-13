import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';
import { tenantExtension } from '../infra/tenancy/tenant.extension';
import { TenantContext } from '../infra/tenancy/tenant-context';
import { TENANT_IDS } from '../infra/tenancy/tenant.constants';
import {
  ModuleStatus,
  ProjectStatus,
  TaskStatus,
  TimeLogSource,
} from '../core/domain/entities/enums';

/**
 * Lança o trabalho concluído da Jenifer (grupo Desenvolvimento) como módulos
 * concluídos + time logs, preenchendo os "buracos" de horas até 8h/dia.
 *
 * - Idempotente: pula módulo cujo nome já exista no projeto.
 * - NÃO mexe em dono/estimativa/status/data dos projetos existentes.
 * - Atribui tudo ao usuário Jenifer (assignee / reporter / timeLog.userId).
 * - DRY_RUN=1 apenas simula e imprime o plano.
 */

const JENI_EMAIL = 'jeni.benites69@gmail.com';
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';

interface Entry {
  project: string; // nome exato do projeto
  name: string;
  description: string;
  hours: number;
  workDate: string; // YYYY-MM-DD
}

const ENTRIES: Entry[] = [
  // ── 11/07 (sábado) — Gerenciamento de RH: batch de 10/07 concentrado (~9h) ──
  {
    project: 'Gerenciamento de RH',
    name: 'PWA — instalação do app (captura global do beforeinstallprompt + one-click)',
    description:
      'Habilitação de PWA instalável: captura global do evento beforeinstallprompt para não perder a janela de oferta de instalação, registro do service worker também em ambiente de desenvolvimento e fluxo de instalação com um clique.',
    hours: 3,
    workDate: '2026-07-11',
  },
  {
    project: 'Gerenciamento de RH',
    name: 'Lembrete semanal de pulso (feedback) com overlay animado',
    description:
      'Lembrete semanal com overlay para o colaborador registrar feedback (pulso), com seleção por emoji e animações para melhorar a experiência e a taxa de resposta.',
    hours: 1,
    workDate: '2026-07-11',
  },
];

function parseDateOnly(value: string): Date {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data inválida: "${value}". Use YYYY-MM-DD.`);
  }
  return date;
}

async function run() {
  const base = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  const prisma = base.$extends(tenantExtension) as unknown as PrismaClient;

  await TenantContext.run(TENANT_IDS.DESENVOLVIMENTO, async () => {
    const jeni = await prisma.user.findFirst({
      where: { email: JENI_EMAIL, isActive: true },
      select: { id: true, name: true },
    });
    if (!jeni) throw new Error(`Usuária não encontrada: ${JENI_EMAIL} no grupo Desenvolvimento.`);
    console.log(`Usuária alvo: ${jeni.name} (${jeni.id})`);
    console.log(DRY_RUN ? '\n*** DRY-RUN — nada será gravado ***\n' : '\n*** GRAVANDO NA PRODUÇÃO ***\n');

    // Resolve projetos e valida existência (nunca cria/atualiza o projeto).
    const projectNames = [...new Set(ENTRIES.map((e) => e.project))];
    const projectMap = new Map<string, string>();
    for (const name of projectNames) {
      const p = await prisma.project.findFirst({ where: { name }, select: { id: true } });
      if (!p) throw new Error(`Projeto não encontrado: "${name}"`);
      projectMap.set(name, p.id);
    }

    let created = 0;
    let skipped = 0;
    const touchedProjects = new Set<string>();

    for (const entry of ENTRIES) {
      const projectId = projectMap.get(entry.project)!;
      const workDate = parseDateOnly(entry.workDate);

      const existing = await prisma.module.findFirst({
        where: { projectId, name: entry.name },
        select: { id: true, loggedHours: true },
      });
      if (existing) {
        console.log(`  = já existe, pulando: [${entry.project}] "${entry.name}"`);
        skipped += 1;
        continue;
      }

      console.log(
        `  ${DRY_RUN ? '[plano]' : '[criar]'} [${entry.project}] "${entry.name}" — ${entry.hours}h em ${entry.workDate}`,
      );
      if (DRY_RUN) {
        created += 1;
        touchedProjects.add(projectId);
        continue;
      }

      await prisma.$transaction(
        async (tx) => {
          const order = await tx.module.count({ where: { projectId } });
          const moduleRow = await tx.module.create({
            data: {
              projectId,
              name: entry.name,
              description: entry.description,
              status: ModuleStatus.CONCLUIDO,
              order,
              progress: 100,
              workDate,
              loggedHours: entry.hours,
              loggedByUserId: jeni.id,
            },
          });

          const epicRow = await tx.epic.create({
            data: {
              projectId,
              moduleId: moduleRow.id,
              name: entry.name,
              description: entry.description,
              status: ProjectStatus.ATIVO,
              startDate: workDate,
              endDate: workDate,
              progress: 100,
            },
          });
          await tx.epicDeveloper.create({ data: { epicId: epicRow.id, userId: jeni.id } });

          const taskRow = await tx.task.create({
            data: {
              projectId,
              moduleId: moduleRow.id,
              epicId: epicRow.id,
              title: entry.name,
              description: entry.description,
              status: TaskStatus.CONCLUIDA,
              complexity: 1,
              assigneeId: jeni.id,
              reporterId: jeni.id,
              estimatedHours: Math.ceil(entry.hours),
              actualHours: entry.hours,
              completedAt: workDate,
              startDate: workDate,
              dueDate: workDate,
              order: 0,
            },
          });

          await tx.timeLog.create({
            data: {
              projectId,
              taskId: taskRow.id,
              userId: jeni.id,
              hours: entry.hours,
              durationSeconds: Math.round(entry.hours * 3600),
              description: entry.description,
              date: workDate,
              startedAt: workDate,
              endedAt: workDate,
              source: TimeLogSource.MANUAL,
              status: TaskStatus.CONCLUIDA,
            },
          });

          const agg = await tx.timeLog.aggregate({
            where: { projectId, endedAt: { not: null } },
            _sum: { hours: true },
          });
          await tx.project.update({
            where: { id: projectId },
            data: { actualHours: agg._sum.hours ?? 0 },
          });
        },
        { timeout: 120_000, maxWait: 30_000 },
      );

      created += 1;
      touchedProjects.add(projectId);
    }

    // Recalcula progresso (média do progresso dos módulos) dos projetos tocados.
    if (!DRY_RUN) {
      for (const projectId of touchedProjects) {
        const mods = await prisma.module.findMany({
          where: { projectId },
          select: { progress: true },
        });
        const progress = mods.length
          ? Math.round(mods.reduce((s, m) => s + m.progress, 0) / mods.length)
          : 0;
        await prisma.project.update({ where: { id: projectId }, data: { progress } });
      }
    }

    console.log(`\nResumo: ${created} módulo(s) ${DRY_RUN ? 'a criar' : 'criado(s)'}, ${skipped} pulado(s).`);

    // Confere as horas por dia da Jenifer depois (ou simulação antes).
    console.log('\n=== Horas por dia (após, dias da janela) ===');
    const logs = await prisma.timeLog.findMany({
      where: { userId: jeni.id, endedAt: { not: null }, date: { gte: parseDateOnly('2026-06-29') } },
      select: { date: true, hours: true },
    });
    const byDay = new Map<string, number>();
    for (const l of logs) {
      const k = l.date.toISOString().slice(0, 10);
      byDay.set(k, (byDay.get(k) ?? 0) + Number(l.hours));
    }
    for (const [d, h] of [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      console.log(`${d}: ${h.toFixed(1)}h${h < 8 ? '  <-- ainda < 8h' : ''}`);
    }
  });

  await base.$disconnect();
}

run().catch((e) => {
  console.error('Erro:', e instanceof Error ? e.message : e);
  process.exit(1);
});
