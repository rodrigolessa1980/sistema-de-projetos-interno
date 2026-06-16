import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { assertValidManifest, runDevlogImport } from '../../../devlog/import-devlog.runner';
import type { DevlogManifest } from '../../../devlog/types';
import { PrismaService } from '../../database/prisma/prisma.service';
import { DevlogApiKeyGuard } from '../guards/devlog-api-key.guard';

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

  /** Lê o arquivo devlog.json do servidor e sincroniza. */
  @Post('sync')
  @UseGuards(DevlogApiKeyGuard)
  async syncFromFile() {
    const { manifest, manifestPath } = loadManifestFromFile();
    const result = await runDevlogImport(this.prisma, manifest);
    return { ok: true, source: 'file', manifestPath, ...result };
  }

  /** Recebe o manifesto no body (útil para CI/scripts externos). */
  @Post('import')
  @UseGuards(DevlogApiKeyGuard)
  async syncFromBody(@Body() body: unknown) {
    const manifest = assertValidManifest(body);
    const result = await runDevlogImport(this.prisma, manifest);
    return { ok: true, source: 'body', ...result };
  }
}
