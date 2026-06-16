import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });

// Correções de datas fora do período (registro manual com data futura)
const FIXES: { id: string; newDate: string; label: string }[] = [
  {
    id: 'c723c085-de51-401e-a8cc-c906d71d1723',
    newDate: '2026-06-08',
    label: 'Motor IA via n8n substituindo Anthropic SDK diretamente',
  },
  {
    id: '9b88d7f7-594f-4e57-8491-b12b6eab7cab',
    newDate: '2026-05-30',
    label: 'Refinamento de pesquisas e Catálogo',
  },
];

async function main() {
  for (const fix of FIXES) {
    const before = await prisma.module.findUnique({
      where: { id: fix.id },
      select: { id: true, name: true, workDate: true },
    });
    if (!before) {
      console.log(`SKIP (não encontrado): ${fix.id} — ${fix.label}`);
      continue;
    }
    const updated = await prisma.module.update({
      where: { id: fix.id },
      data: { workDate: new Date(`${fix.newDate}T12:00:00.000Z`) },
      select: { id: true, name: true, workDate: true },
    });
    console.log(
      `OK: "${updated.name}"\n   ${before.workDate?.toISOString().split('T')[0]} -> ${updated.workDate?.toISOString().split('T')[0]}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
