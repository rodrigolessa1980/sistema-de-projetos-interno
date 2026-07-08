import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../infra/config/mysql.config';
import { assertValidManifest, runDevlogImport } from '../devlog/import-devlog.runner';
import { tenantExtension } from '../infra/tenancy/tenant.extension';
import { TenantContext } from '../infra/tenancy/tenant-context';
import { TENANT_SLUGS } from '../infra/tenancy/tenant.constants';

function resolveManifestPath(): string {
  if (process.env.DEVLOG_PATH) {
    return resolve(process.env.DEVLOG_PATH);
  }
  return resolve(process.cwd(), '..', 'devlog.json');
}

async function main() {
  const manifestPath = resolveManifestPath();
  console.log(`Lendo manifesto: ${manifestPath}`);

  const raw = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const manifest = assertValidManifest(raw);

  const base = new PrismaClient({ adapter: createPrismaMariaDbAdapter() });
  // Import pertence ao grupo Desenvolvimento (configurável via DEVLOG_TENANT_SLUG).
  const prisma = base.$extends(tenantExtension) as unknown as PrismaClient;

  try {
    const slug = process.env.DEVLOG_TENANT_SLUG ?? TENANT_SLUGS.DESENVOLVIMENTO;
    const tenant = await base.tenant.findUnique({ where: { slug } });
    if (!tenant) {
      throw new Error(`Grupo (tenant) "${slug}" não encontrado. Rode as migrations primeiro.`);
    }
    const result = await TenantContext.run(tenant.id, () =>
      runDevlogImport(prisma, manifest),
    );
    console.log('\nImportação concluída:');
    console.log(`  Projetos criados: ${result.projectsCreated}`);
    console.log(`  Projetos atualizados: ${result.projectsUpdated}`);
    console.log(`  Módulos criados: ${result.modulesCreated}`);
    console.log(`  Módulos atualizados: ${result.modulesUpdated}`);
    console.log(`  Módulos ignorados (já com horas): ${result.modulesSkipped}`);
    console.log(`  Projetos removidos: ${result.projectsRemoved}`);
    console.log(`  Módulos seed removidos: ${result.seedModulesRemoved}`);
    console.log(`  Time logs criados: ${result.timeLogsCreated}`);
    console.log('\nDetalhes:');
    for (const line of result.details) {
      console.log(line);
    }
  } finally {
    await base.$disconnect();
  }
}

main().catch((error) => {
  console.error('Erro na importação:', error instanceof Error ? error.message : error);
  process.exit(1);
});
