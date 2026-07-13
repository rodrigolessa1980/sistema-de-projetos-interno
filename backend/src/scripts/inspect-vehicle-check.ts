import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });

async function main() {
  const projects = await prisma.project.findMany({
    where: { name: { contains: 'Vehicle' } },
    select: {
      id: true,
      tenantId: true,
      name: true,
      status: true,
      progress: true,
      actualHours: true,
      estimatedHours: true,
      startDate: true,
      endDate: true,
      ownerId: true,
      owner: { select: { name: true, email: true } },
      developers: { select: { user: { select: { id: true, name: true, email: true } } } },
      modules: {
        select: { id: true, name: true, status: true, progress: true, loggedHours: true, workDate: true },
        orderBy: { order: 'asc' },
      },
      tasks: {
        select: { id: true, title: true, status: true, actualHours: true, estimatedHours: true, assignee: { select: { name: true } } },
      },
      _count: { select: { tasks: true, timeLogs: true } },
    },
  });

  const jenifer = await prisma.user.findMany({
    where: { name: { contains: 'Jenifer' } },
    select: { id: true, name: true, email: true, tenantId: true },
  });

  console.log(JSON.stringify({ projects, jenifer }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
