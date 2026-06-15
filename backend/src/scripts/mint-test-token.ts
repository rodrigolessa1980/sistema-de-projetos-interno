import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';
import {
  extractApiTokenPrefix,
  generateApiTokenValue,
  hashApiToken,
} from '../core/permissions/api-token.util';

const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });

// Token de teste somente-leitura + criação de tarefa, validade curta.
const SCOPES = [
  'projects:read',
  'modules:read',
  'epics:read',
  'users:read',
  'tasks:read',
  'tasks:create',
  'timelogs:read',
  'modules:create',
  'modules:update',
];

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN', isActive: true },
    select: { id: true, name: true, email: true },
  });
  if (!admin) throw new Error('Nenhum usuário ADMIN ativo encontrado.');

  const plainToken = generateApiTokenValue();
  const record = await prisma.apiToken.create({
    data: {
      userId: admin.id,
      name: 'TESTE-AUTOMATIZADO (temporário)',
      tokenHash: hashApiToken(plainToken),
      tokenPrefix: extractApiTokenPrefix(plainToken),
      scopes: SCOPES,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
    },
    select: { id: true },
  });

  console.log(JSON.stringify({ tokenId: record.id, token: plainToken, user: admin.email }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
