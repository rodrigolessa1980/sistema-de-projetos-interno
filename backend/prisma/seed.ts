import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '../src/generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../src/infra/config/mysql.config';

const prisma = new PrismaClient({
  adapter: createPrismaMariaDbAdapter(),
});

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@devflow.com' },
    update: {},
    create: {
      name: 'Rafael Monteiro',
      email: 'admin@devflow.com',
      passwordHash,
      role: UserRole.ADMIN,
      position: 'CTO',
      department: 'Tecnologia',
      avatar: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f98a.png',
    },
  });

  const devPassword = await bcrypt.hash('dev123', 10);
  const developers = [
    {
      name: 'Ana Carolina Silva',
      email: 'ana@devflow.com',
      position: 'Senior Frontend Developer',
      department: 'Engenharia',
    },
    {
      name: 'Lucas Ferreira',
      email: 'lucas@devflow.com',
      position: 'Backend Engineer',
      department: 'Engenharia',
    },
    {
      name: 'Fernanda Lima',
      email: 'fernanda@devflow.com',
      position: 'Full Stack Developer',
      department: 'Engenharia',
    },
  ];

  for (const dev of developers) {
    await prisma.user.upsert({
      where: { email: dev.email },
      update: {},
      create: {
        ...dev,
        passwordHash: devPassword,
        role: UserRole.DEVELOPER,
      },
    });
  }

  const companies = [
    { name: 'Monkey Tech', shortName: 'MKT', color: '#8B5CF6', cnpj: null },
    { name: 'Cliente Alpha', shortName: 'ALP', color: '#3B82F6', cnpj: null },
    { name: 'Cliente Beta', shortName: 'BET', color: '#10B981', cnpj: null },
  ];

  for (const company of companies) {
    const existing = await prisma.company.findFirst({
      where: { shortName: company.shortName },
    });
    if (!existing) {
      await prisma.company.create({ data: company });
    }
  }

  console.log('Seed concluído: usuários e empresas iniciais criados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
