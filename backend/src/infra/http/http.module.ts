import { Module } from '@nestjs/common';
import { UseCasesModule } from '../../core/use-cases/use-cases.module';
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
import { PermissionsGuard } from './guards/permissions.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [UseCasesModule],
  providers: [PermissionsGuard, JwtAuthGuard],
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
  ],
})
export class HttpModule {}
