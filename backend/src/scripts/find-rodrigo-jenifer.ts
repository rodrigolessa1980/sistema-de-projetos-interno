import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

/**
 * SÓ LEITURA. Lista tenants e procura usuários cujo nome/e-mail contenha
 * "rodrigo" ou "jenifer" (qualquer variação), mostrando grupo, papel e status.
 */
async function main() {
  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  try {
    const tenants = await prisma.tenant.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { createdAt: 'asc' },
    });
    console.log('Tenants:');
    for (const t of tenants) {
      console.log(`  - ${t.name} (slug=${t.slug}) id=${t.id}`);
    }

    const terms = ['rodrigo', 'jenifer', 'jennifer'];
    const users = await prisma.user.findMany({
      where: {
        OR: terms.flatMap((term) => [
          { name: { contains: term } },
          { email: { contains: term } },
        ]),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        isActive: true,
        tenantId: true,
      },
      orderBy: [{ email: 'asc' }],
    });

    const tenantName = (id: string) =>
      tenants.find((t) => t.id === id)?.slug ?? id;

    console.log(`\nUsuários encontrados (${users.length}):`);
    for (const u of users) {
      console.log(
        `  [${tenantName(u.tenantId)}] ${u.name} <${u.email}> role=${u.role} approved=${u.isApproved} active=${u.isActive} id=${u.id}`,
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
