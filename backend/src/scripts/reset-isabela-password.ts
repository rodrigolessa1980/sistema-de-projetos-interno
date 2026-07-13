import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

/**
 * Reseta a senha da Isabela (grupo Marketing) para uma senha temporária.
 * Roda contra o banco apontado pelo .env.
 *
 * Uso: npm run build --silent && node dist/scripts/reset-isabela-password.js
 */
const TARGET_SLUG = 'marketing';
const TARGET_EMAIL = 'isabela.lazzaris@petkovgb.com.br';
const NEW_PASSWORD = 'senha123';

async function main() {
  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  try {
    const tenant = await prisma.tenant.findUnique({ where: { slug: TARGET_SLUG } });
    if (!tenant) throw new Error(`Grupo "${TARGET_SLUG}" não encontrado.`);

    const user = await prisma.user.findFirst({
      where: { email: TARGET_EMAIL, tenantId: tenant.id },
    });
    if (!user) throw new Error(`Usuário ${TARGET_EMAIL} não encontrado no grupo ${TARGET_SLUG}.`);

    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, isActive: true, isApproved: true },
    });

    // Sanidade: confirma que a nova senha bate.
    const check = await prisma.user.findUnique({ where: { id: user.id } });
    const ok = await bcrypt.compare(NEW_PASSWORD, check!.passwordHash);

    console.log(
      `Senha redefinida para ${user.name} <${user.email}> ` +
        `[grupo=${TARGET_SLUG}] id=${user.id}. compare()=${ok}.`,
    );
    console.log(`Login: grupo "Marketing" · email ${TARGET_EMAIL} · senha ${NEW_PASSWORD}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Erro:', error instanceof Error ? error.message : error);
  process.exit(1);
});
