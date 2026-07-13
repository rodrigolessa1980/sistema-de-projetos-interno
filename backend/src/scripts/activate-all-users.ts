import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

/**
 * Ativa e aprova TODOS os usuários cadastrados, em todos os grupos (tenants):
 * define isApproved=true e isActive=true para qualquer conta que ainda não esteja.
 *
 * Idempotente: contas já ativas/aprovadas são puladas. Roda contra o banco
 * apontado pelo .env.
 *
 * ATENÇÃO: isto também reativa contas que possam ter sido DESATIVADAS de
 * propósito. Confira a listagem antes de confirmar em produção.
 *
 * Uso: npm run build --silent && node dist/scripts/activate-all-users.js
 */
async function main() {
  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  try {
    const tenants = await prisma.tenant.findMany({ select: { id: true, slug: true } });
    const slugOf = (id: string) => tenants.find((t) => t.id === id)?.slug ?? id;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        isActive: true,
        tenantId: true,
      },
      orderBy: [{ tenantId: 'asc' }, { email: 'asc' }],
    });

    const pending = users.filter((u) => !u.isApproved || !u.isActive);
    console.log(`Total de usuários: ${users.length}. A ajustar: ${pending.length}.\n`);

    for (const u of pending) {
      await prisma.user.update({
        where: { id: u.id },
        data: { isApproved: true, isActive: true },
      });
      console.log(
        `  ^ [${slugOf(u.tenantId)}] ${u.name} <${u.email}> ` +
          `(era approved=${u.isApproved} active=${u.isActive}) → aprovado e ativo.`,
      );
    }

    if (pending.length === 0) {
      console.log('  = Nada a fazer: todos já estavam aprovados e ativos.');
    }

    // Confirmação final.
    console.log('\nEstado final:');
    const all = await prisma.user.findMany({
      select: { name: true, email: true, role: true, isApproved: true, isActive: true, tenantId: true },
      orderBy: [{ tenantId: 'asc' }, { email: 'asc' }],
    });
    for (const u of all) {
      console.log(
        `  [${slugOf(u.tenantId)}] ${u.name} <${u.email}> role=${u.role} approved=${u.isApproved} active=${u.isActive}`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Erro:', error instanceof Error ? error.message : error);
  process.exit(1);
});
