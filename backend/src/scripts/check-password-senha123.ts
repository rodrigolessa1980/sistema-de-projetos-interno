import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

/**
 * SÓ LEITURA. Para cada usuário, testa se a senha "senha123" bate com o hash
 * armazenado. Serve para verificar se as contas foram criadas com essa senha.
 *
 * Uso: npm run build --silent && node dist/scripts/check-password-senha123.js
 */
const CANDIDATE = 'senha123';

async function main() {
  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  try {
    const tenants = await prisma.tenant.findMany({ select: { id: true, slug: true } });
    const slugOf = (id: string) => tenants.find((t) => t.id === id)?.slug ?? id;

    const users = await prisma.user.findMany({
      select: { name: true, email: true, passwordHash: true, tenantId: true },
      orderBy: [{ tenantId: 'asc' }, { email: 'asc' }],
    });

    console.log(`Testando a senha "${CANDIDATE}" contra ${users.length} usuários:\n`);
    for (const u of users) {
      const match = await bcrypt.compare(CANDIDATE, u.passwordHash);
      console.log(`  ${match ? '✔ BATE ' : '�’ não  '} [${slugOf(u.tenantId)}] ${u.name} <${u.email}>`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Erro:', error instanceof Error ? error.message : error);
  process.exit(1);
});
