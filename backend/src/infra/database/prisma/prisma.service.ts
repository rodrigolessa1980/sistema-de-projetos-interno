import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../../config/mysql.config';
import { tenantExtension } from '../../tenancy/tenant.extension';

/**
 * Client BASE, sem isolamento de tenant. Responsável pela conexão física.
 *
 * Use SOMENTE onde ainda não existe contexto de tenant e a operação é
 * legitimamente global: JwtAuthGuard, PermissionService, login/registro
 * (busca de e-mail global) e scripts/seed.
 */
@Injectable()
export class BasePrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter: createPrismaMariaDbAdapter() });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

/** Constrói o client estendido (com isolamento por tenant) a partir do base. */
export function createTenantPrismaClient(base: BasePrismaService) {
  return base.$extends(tenantExtension);
}

/**
 * Token de injeção usado por TODOS os repositories e pelas queries diretas de
 * controller. É provido (via factory no PrismaModule) como o client ESTENDIDO,
 * que injeta `tenantId` automaticamente. A classe serve apenas como token + tipo
 * e nunca é instanciada diretamente.
 */
@Injectable()
export class PrismaService extends PrismaClient {}
