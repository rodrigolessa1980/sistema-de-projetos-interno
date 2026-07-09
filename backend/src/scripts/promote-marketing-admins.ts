import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

/**
 * Torna Rodrigo e Jenifer ADMIN também no grupo Marketing (já são ADMIN em
 * Desenvolvimento). E-mail é único POR grupo, então cada um vira um registro
 * SEPARADO no Marketing, com a MESMA senha da conta de Desenvolvimento.
 *
 * Idempotente: se a conta já existir no Marketing, apenas promove a ADMIN e
 * garante approved/active. Roda contra o banco apontado pelo .env.
 *
 * Uso: npm run build --silent && node dist/scripts/promote-marketing-admins.js
 */
const TARGET_SLUG = 'marketing';
const TARGET_EMAILS = ['jeni.benites69@gmail.com', 'rodrigo.lessa@monkeybranch.dev'];

async function main() {
  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  try {
    const tenant = await prisma.tenant.findUnique({ where: { slug: TARGET_SLUG } });
    if (!tenant) {
      throw new Error(`Grupo (tenant) com slug "${TARGET_SLUG}" não encontrado.`);
    }

    for (const rawEmail of TARGET_EMAILS) {
      const email = rawEmail.trim().toLowerCase();

      // Conta com o mesmo e-mail em OUTRO grupo (fonte de senha/nome).
      const twin = await prisma.user.findFirst({
        where: { email, NOT: { tenantId: tenant.id } },
        orderBy: { createdAt: 'asc' },
      });
      if (!twin) {
        console.log(`  ! ${email}: nenhuma conta em outro grupo para copiar. PULANDO.`);
        continue;
      }

      const existing = await prisma.user.findFirst({
        where: { email, tenantId: tenant.id },
      });

      if (existing) {
        if (
          existing.role === 'ADMIN' &&
          existing.isApproved &&
          existing.isActive
        ) {
          console.log(`  = ${email}: já é ADMIN ativo no Marketing (id=${existing.id}). Nada a fazer.`);
        } else {
          await prisma.user.update({
            where: { id: existing.id },
            data: { role: 'ADMIN', isApproved: true, isActive: true },
          });
          console.log(`  ^ ${email}: promovido a ADMIN no Marketing (id=${existing.id}).`);
        }
        continue;
      }

      const created = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          name: twin.name,
          email,
          passwordHash: twin.passwordHash, // mesma senha do Desenvolvimento
          role: 'ADMIN',
          position: twin.position,
          department: twin.department,
          avatar: twin.avatar,
          isActive: true,
          isApproved: true,
        },
        select: { id: true },
      });
      console.log(`  + ${email}: ADMIN criado no Marketing (id=${created.id}, senha copiada de "${twin.name}").`);
    }

    // Confirmação final: lista as contas dos dois e-mails em todos os grupos.
    console.log('\nEstado final:');
    const tenants = await prisma.tenant.findMany({ select: { id: true, slug: true } });
    const slugOf = (id: string) => tenants.find((t) => t.id === id)?.slug ?? id;
    const all = await prisma.user.findMany({
      where: { email: { in: TARGET_EMAILS } },
      select: { name: true, email: true, role: true, isApproved: true, isActive: true, tenantId: true },
      orderBy: [{ email: 'asc' }],
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
