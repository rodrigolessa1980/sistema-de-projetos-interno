import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });

async function main() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const byUser = await prisma.timeLog.groupBy({
    by: ['userId'],
    _sum: { hours: true },
    _count: { id: true },
  });
  const map = new Map(byUser.map((r) => [r.userId, { hours: Number(r._sum.hours ?? 0), count: r._count.id }]));

  const oldestAdmin = users.find((u) => u.role === 'ADMIN');

  console.log('=== Horas por usuário (timeLogs) ===');
  for (const u of users) {
    const d = map.get(u.id) ?? { hours: 0, count: 0 };
    const tag = u.id === oldestAdmin?.id ? '  <-- admin mais antigo (recebeu o import)' : '';
    console.log(`${u.name} <${u.email}> [${u.role}] : ${d.hours.toFixed(1)}h em ${d.count} logs${tag}`);
  }

  const total = [...map.values()].reduce((a, b) => a + b.hours, 0);
  console.log(`\nTotal geral em timeLogs: ${total.toFixed(1)}h`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
