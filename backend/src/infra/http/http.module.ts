import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UseCasesModule } from '../../core/use-cases/use-cases.module';
import { TenantContextInterceptor } from '../tenancy/tenant.interceptor';
import { AuthController } from './controllers/auth.controller';
import { CompaniesController } from './controllers/companies.controller';
import { HealthController } from './controllers/health.controller';
import { TasksController } from './controllers/tasks.controller';
import { ProjectsController } from './controllers/projects.controller';
import { TimeLogsController } from './controllers/time-logs.controller';
import { UsersController } from './controllers/users.controller';
import { ModulesController } from './controllers/modules.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { ReportsController } from './controllers/reports.controller';
import { DevlogController } from './controllers/devlog.controller';
import { ApiTokensController } from './controllers/api-tokens.controller';
import { BootstrapController } from './controllers/bootstrap.controller';
import { SyncController } from './controllers/sync.controller';
import { SyncStreamController } from './controllers/sync-stream.controller';
import { PermissionsGuard } from './guards/permissions.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SseAuthGuard } from './guards/sse-auth.guard';
import { SyncEmitInterceptor } from './interceptors/sync-emit.interceptor';

@Module({
  imports: [UseCasesModule],
  providers: [
    PermissionsGuard,
    JwtAuthGuard,
    SseAuthGuard,
    { provide: APP_INTERCEPTOR, useClass: TenantContextInterceptor },
    // INC-14: emite evento de mudança (por tenant) após escritas HTTP -> alimenta o SSE.
    { provide: APP_INTERCEPTOR, useClass: SyncEmitInterceptor },
  ],
  controllers: [
    HealthController,
    AuthController,
    CompaniesController,
    TasksController,
    ProjectsController,
    TimeLogsController,
    UsersController,
    ModulesController,
    NotificationsController,
    ReportsController,
    DevlogController,
    ApiTokensController,
    BootstrapController,
    SyncController,
    SyncStreamController,
  ],
})
export class HttpModule {}
