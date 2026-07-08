import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';

/**
 * Cria um admin de um grupo (tenant). E-mail é único POR GRUPO, então o mesmo
 * e-mail pode virar admin de vários grupos (ex.: rafaelfet@gmail.com em
 * Desenvolvimento E Marketing — escolhendo o grupo no login).
 *
 * Senha: se ADMIN_PASSWORD não for informada, COPIA a senha de uma conta
 * existente com o MESMO e-mail em outro grupo (mesma senha, escolhe o grupo).
 *
 * Uso (PowerShell) — clonar a conta existente para o Marketing (mesma senha):
 *   $env:TENANT_SLUG='marketing'; $env:ADMIN_EMAIL='rafaelfet@gmail.com'
 *   npm run build --silent; node dist/scripts/create-tenant-admin.js
 */
async function main() {
  const slug = (process.env.TENANT_SLUG ?? 'marketing').trim().toLowerCase();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error('Defina ADMIN_EMAIL (e TENANT_SLUG; ADMIN_PASSWORD é opcional se o e-mail já existir em outro grupo).');
  }
  if (password && password.length < 6) {
    throw new Error('ADMIN_PASSWORD deve ter pelo menos 6 caracteres.');
  }

  const prisma = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  try {
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) {
      throw new Error(`Grupo (tenant) com slug "${slug}" não encontrado.`);
    }

    // E-mail é único por grupo: só é conflito se já existir NESTE grupo.
    const existingHere = await prisma.user.findFirst({
      where: { email, tenantId: tenant.id },
    });
    if (existingHere) {
      throw new Error(`Já existe um usuário com o e-mail "${email}" no grupo "${tenant.slug}".`);
    }

    // Conta com o mesmo e-mail em OUTRO grupo (para copiar senha/nome).
    const twin = await prisma.user.findFirst({
      where: { email, NOT: { tenantId: tenant.id } },
      orderBy: { createdAt: 'asc' },
    });

    let passwordHash: string;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    } else if (twin) {
      passwordHash = twin.passwordHash;
      console.log(`Copiando senha da conta existente "${email}" (grupo de origem).`);
    } else {
      throw new Error(
        `ADMIN_PASSWORD é obrigatório: não há conta "${email}" em outro grupo para copiar a senha.`,
      );
    }

    const name = process.env.ADMIN_NAME?.trim() || twin?.name || email;
    const position = process.env.ADMIN_POSITION?.trim() || twin?.position || 'Administrador';
    const department = process.env.ADMIN_DEPARTMENT?.trim() || twin?.department || 'Gestão';
    const avatar =
      twin?.avatar ??
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name,
        email,
        passwordHash,
        role: 'ADMIN',
        position,
        department,
        avatar,
        isActive: true,
        isApproved: true,
      },
      select: { id: true, email: true },
    });

    console.log(
      `Admin criado no grupo "${tenant.name}" (${tenant.slug}): ${user.email} [id=${user.id}]`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Erro:', error instanceof Error ? error.message : error);
  process.exit(1);
});
