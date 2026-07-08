import { Global, Module } from '@nestjs/common';
import {
  BasePrismaService,
  PrismaService,
  createTenantPrismaClient,
} from './prisma.service';

@Global()
@Module({
  providers: [
    BasePrismaService,
    {
      // Client estendido (isolado por tenant) — injetado por repositories/controllers.
      provide: PrismaService,
      useFactory: (base: BasePrismaService) =>
        createTenantPrismaClient(base) as unknown as PrismaService,
      inject: [BasePrismaService],
    },
  ],
  exports: [BasePrismaService, PrismaService],
})
export class PrismaModule {}
