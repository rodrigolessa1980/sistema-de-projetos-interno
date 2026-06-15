import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });

async function main() {
  const projects = await prisma.project.findMany({
    orderBy: [{ status: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      status: true,
      progress: true,
      actualHours: true,
      estimatedHours: true,
      startDate: true,
      endDate: true,
      modules: {
        select: {
          id: true,
          name: true,
          status: true,
          progress: true,
          loggedHours: true,
          workDate: true,
        },
        orderBy: { order: 'asc' },
      },
      _count: { select: { tasks: true, timeLogs: true } },
    },
  });

  const timeByProject = await prisma.timeLog.groupBy({
    by: ['projectId'],
    where: { endedAt: { not: null } },
    _sum: { hours: true },
    _count: { id: true },
  });
  const hoursMap = new Map(timeByProject.map((r) => [r.projectId, r._sum.hours ?? 0]));

  console.log(JSON.stringify({
    projects: projects.map((p) => ({
      ...p,
      startDate: p.startDate?.toISOString().split('T')[0],
      endDate: p.endDate?.toISOString().split('T')[0],
      timeLogHours: hoursMap.get(p.id) ?? 0,
      modules: p.modules.map((m) => ({
        ...m,
        workDate: m.workDate?.toISOString().split('T')[0] ?? null,
      })),
    })),
  }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
