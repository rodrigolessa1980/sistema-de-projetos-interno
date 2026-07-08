import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { assertValidManifest, runDevlogImport } from '../../../devlog/import-devlog.runner';
import type { DevlogManifest } from '../../../devlog/types';
import { PrismaService } from '../../database/prisma/prisma.service';
import { DevlogApiKeyGuard } from '../guards/devlog-api-key.guard';
import { TenantContext } from '../../tenancy/tenant-context';
import { TENANT_SLUGS } from '../../tenancy/tenant.constants';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';

function resolveManifestPath(): string {
  if (process.env.DEVLOG_PATH) {
    return resolve(process.env.DEVLOG_PATH);
  }
  return resolve(process.cwd(), '..', 'devlog.json');
}

function loadManifestFromFile(): { manifest: DevlogManifest; manifestPath: string } {
  const manifestPath = resolveManifestPath();
  const raw = JSON.parse(readFileSync(manifestPath, 'utf8'));
  return { manifest: assertValidManifest(raw), manifestPath };
}

@Controller('devlog')
export class DevlogController {
  constructor(private readonly prisma: PrismaService) {}

  // A rota de devlog usa API key (não JWT), então não há tenant no contexto.
  // O import pertence ao grupo Desenvolvimento (configurável via DEVLOG_TENANT_SLUG).
  private async resolveTenantId(): Promise<string> {
    const slug = process.env.DEVLOG_TENANT_SLUG ?? TENANT_SLUGS.DESENVOLVIMENTO;
    // Tenant não é filtrado pela extensão, então funciona sem contexto.
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) {
      throw new NotFoundException('Grupo (tenant) do devlog', slug);
    }
    return tenant.id;
  }

  /** Lê o arquivo devlog.json do servidor e sincroniza. */
  @Post('sync')
  @UseGuards(DevlogApiKeyGuard)
  async syncFromFile() {
    const { manifest, manifestPath } = loadManifestFromFile();
    const tenantId = await this.resolveTenantId();
    const result = await TenantContext.run(tenantId, () =>
      runDevlogImport(this.prisma, manifest),
    );
    return { ok: true, source: 'file', manifestPath, ...result };
  }

  /** Recebe o manifesto no body (útil para CI/scripts externos). */
  @Post('import')
  @UseGuards(DevlogApiKeyGuard)
  async syncFromBody(@Body() body: unknown) {
    const manifest = assertValidManifest(body);
    const tenantId = await this.resolveTenantId();
    const result = await TenantContext.run(tenantId, () =>
      runDevlogImport(this.prisma, manifest),
    );
    return { ok: true, source: 'body', ...result };
  }
}
