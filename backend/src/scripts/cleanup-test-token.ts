import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });

// IDs gerados durante o teste manual da API
const TASK_ID = process.env.CLEAN_TASK_ID;
const TOKEN_ID = process.env.CLEAN_TOKEN_ID;

async function main() {
  if (TASK_ID) {
    await prisma.task.deleteMany({ where: { id: TASK_ID } });
    console.log(`Tarefa de teste removida: ${TASK_ID}`);
  }
  if (TOKEN_ID) {
    await prisma.apiToken.deleteMany({ where: { id: TOKEN_ID } });
    console.log(`Token de teste removido: ${TOKEN_ID}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
