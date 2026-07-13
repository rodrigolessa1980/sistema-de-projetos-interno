import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

/**
 * SÓ LEITURA. Levanta o estado atual antes de lançar horas da Jenifer:
 *  - projetos GESTAO RH e FiscalMind (nome exato, id, tenant, owner)
 *  - usuário(s) da Jenifer
 *  - time logs da Jenifer agrupados por dia (para achar dias < 8h)
 *  - módulos já existentes nos dois projetos (evitar duplicidade)
 */
async function main() {
  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: 'RH' } },
          { name: { contains: 'Fiscal' } },
          { name: { contains: 'Gest' } },
        ],
      },
      select: {
        id: true,
        name: true,
        tenantId: true,
        ownerId: true,
        status: true,
        estimatedHours: true,
        actualHours: true,
        startDate: true,
        owner: { select: { name: true, email: true } },
      },
    });
    console.log('=== PROJETOS (match RH/Fiscal/Gest) ===');
    for (const p of projects) {
      console.log(
        `- "${p.name}" id=${p.id} tenant=${p.tenantId} status=${p.status} est=${p.estimatedHours}h atual=${p.actualHours}h owner=${p.owner.name} <${p.owner.email}> start=${p.startDate?.toISOString().slice(0, 10)}`,
      );
    }

    const jeni = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: 'enifer' } },
          { email: { contains: 'enifer' } },
          { email: { contains: 'benites' } },
        ],
      },
      select: { id: true, name: true, email: true, role: true, tenantId: true, isActive: true },
    });
    console.log('\n=== USUÁRIOS JENIFER ===');
    for (const u of jeni) {
      console.log(`- ${u.name} <${u.email}> role=${u.role} tenant=${u.tenantId} active=${u.isActive} id=${u.id}`);
    }

    const jeniIds = jeni.map((u) => u.id);
    if (jeniIds.length) {
      const logs = await prisma.timeLog.findMany({
        where: { userId: { in: jeniIds }, endedAt: { not: null } },
        select: { date: true, hours: true, projectId: true },
        orderBy: { date: 'asc' },
      });
      const projName = new Map(projects.map((p) => [p.id, p.name]));
      const byDay = new Map<string, number>();
      for (const l of logs) {
        const key = l.date.toISOString().slice(0, 10);
        byDay.set(key, (byDay.get(key) ?? 0) + Number(l.hours));
      }
      console.log(`\n=== HORAS DA JENIFER POR DIA (${logs.length} logs finalizados) ===`);
      const days = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      for (const [day, h] of days) {
        const flag = h < 8 ? `  <-- faltam ${(8 - h).toFixed(1)}h` : '';
        console.log(`${day}: ${h.toFixed(1)}h${flag}`);
      }

      // Foco na janela relevante (últimas 3 semanas até hoje)
      console.log('\n=== JUNHO/JULHO 2026 (detalhe por projeto) ===');
      const focus = logs.filter((l) => {
        const k = l.date.toISOString().slice(0, 10);
        return k >= '2026-06-29' && k <= '2026-07-13';
      });
      const byDayProj = new Map<string, Map<string, number>>();
      for (const l of focus) {
        const k = l.date.toISOString().slice(0, 10);
        if (!byDayProj.has(k)) byDayProj.set(k, new Map());
        const m = byDayProj.get(k)!;
        const pn = projName.get(l.projectId) ?? l.projectId;
        m.set(pn, (m.get(pn) ?? 0) + Number(l.hours));
      }
      for (const [day, m] of [...byDayProj.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
        const parts = [...m.entries()].map(([pn, h]) => `${pn}=${h.toFixed(1)}h`).join(', ');
        const tot = [...m.values()].reduce((a, b) => a + b, 0);
        console.log(`${day}: total=${tot.toFixed(1)}h  (${parts})`);
      }
    }

    const projIds = projects.map((p) => p.id);
    if (projIds.length) {
      const mods = await prisma.module.findMany({
        where: { projectId: { in: projIds } },
        select: { name: true, projectId: true, status: true, workDate: true, loggedHours: true },
        orderBy: { order: 'asc' },
      });
      const projName = new Map(projects.map((p) => [p.id, p.name]));
      console.log(`\n=== MÓDULOS EXISTENTES nos projetos (${mods.length}) ===`);
      for (const m of mods) {
        console.log(
          `[${projName.get(m.projectId)}] "${m.name}" status=${m.status} workDate=${m.workDate?.toISOString().slice(0, 10) ?? '-'} loggedHours=${m.loggedHours ?? '-'}`,
        );
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Erro:', e instanceof Error ? e.message : e);
  process.exit(1);
});
