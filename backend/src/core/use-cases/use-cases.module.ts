import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Auth Use Cases
import { LoginUseCase } from './auth/login.use-case';
import { RegisterUseCase } from './auth/register.use-case';
import { GetCurrentUserUseCase } from './auth/get-current-user.use-case';

// Company Use Cases
import { ListCompaniesUseCase } from './companies/list-companies.use-case';
import { GetCompanyByIdUseCase } from './companies/get-company-by-id.use-case';
import { CreateCompanyUseCase } from './companies/create-company.use-case';
import { UpdateCompanyUseCase } from './companies/update-company.use-case';
import { DeleteCompanyUseCase } from './companies/delete-company.use-case';

// Project Use Cases
import { ListProjectsUseCase } from './projects/list-projects.use-case';
import { GetProjectByIdUseCase } from './projects/get-project-by-id.use-case';
import { CreateProjectUseCase } from './projects/create-project.use-case';
import { UpdateProjectUseCase } from './projects/update-project.use-case';
import { DeleteProjectUseCase } from './projects/delete-project.use-case';
import { GetQueuedProjectsUseCase } from './projects/get-queued-projects.use-case';
import { ReorderQueueUseCase } from './projects/reorder-queue.use-case';
import { AddDeveloperUseCase } from './projects/add-developer.use-case';
import { RemoveDeveloperUseCase } from './projects/remove-developer.use-case';
import { CreateModuleUseCase } from './modules/create-module.use-case';
import { UpdateModuleUseCase } from './modules/update-module.use-case';
import { DeleteModuleUseCase } from './modules/delete-module.use-case';
import { ListModulesByProjectUseCase } from './modules/list-modules-by-project.use-case';
import { CreateEpicUseCase } from './epics/create-epic.use-case';
import { ListEpicsByProjectUseCase } from './epics/list-epics-by-project.use-case';

// Task Use Cases
import { CreateTaskUseCase } from './tasks/create-task.use-case';
import { UpdateTaskUseCase } from './tasks/update-task.use-case';
import { DeleteTaskUseCase } from './tasks/delete-task.use-case';
import { GetTaskByIdUseCase } from './tasks/get-task-by-id.use-case';
import { ListTasksByProjectUseCase } from './tasks/list-tasks-by-project.use-case';
import { ListTasksByAssigneeUseCase } from './tasks/list-tasks-by-assignee.use-case';
import { SetTaskUrgentUseCase } from './tasks/set-task-urgent.use-case';
import { ReorderKanbanTasksUseCase } from './tasks/reorder-kanban-tasks.use-case';

// TimeLog Use Cases
import { CreateTimeLogUseCase } from './time-logs/create-time-log.use-case';
import { StartTimerUseCase } from './time-logs/start-timer.use-case';
import { StopTimerUseCase } from './time-logs/stop-timer.use-case';
import { GetActiveSessionUseCase } from './time-logs/get-active-session.use-case';
import { ListTimeLogsByTaskUseCase } from './time-logs/list-time-logs-by-task.use-case';
import { ListTimeLogsByUserUseCase } from './time-logs/list-time-logs-by-user.use-case';
import { DeleteTimeLogUseCase } from './time-logs/delete-time-log.use-case';

// User Use Cases
import { ListUsersUseCase } from './users/list-users.use-case';
import { GetUserPermissionsUseCase } from './users/get-user-permissions.use-case';
import { UpdateUserPermissionsUseCase } from './users/update-user-permissions.use-case';

const useCases = [
  // Auth
  LoginUseCase,
  RegisterUseCase,
  GetCurrentUserUseCase,


  // Companies
  ListCompaniesUseCase,
  GetCompanyByIdUseCase,
  CreateCompanyUseCase,
  UpdateCompanyUseCase,
  DeleteCompanyUseCase,

  // Projects
  ListProjectsUseCase,
  GetProjectByIdUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  GetQueuedProjectsUseCase,
  ReorderQueueUseCase,
  AddDeveloperUseCase,
  RemoveDeveloperUseCase,

  // Modules
  CreateModuleUseCase,
  UpdateModuleUseCase,
  DeleteModuleUseCase,
  ListModulesByProjectUseCase,

  // Epics
  CreateEpicUseCase,
  ListEpicsByProjectUseCase,

  // Tasks
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
  ListTasksByProjectUseCase,
  ListTasksByAssigneeUseCase,
  SetTaskUrgentUseCase,
  ReorderKanbanTasksUseCase,

  // TimeLogs
  CreateTimeLogUseCase,
  StartTimerUseCase,
  StopTimerUseCase,
  GetActiveSessionUseCase,
  ListTimeLogsByTaskUseCase,
  ListTimeLogsByUserUseCase,
  DeleteTimeLogUseCase,

  // Users & Permissions
  ListUsersUseCase,
  GetUserPermissionsUseCase,
  UpdateUserPermissionsUseCase,
];

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'devflow-jwt-secret-change-in-production'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [...useCases],
  exports: [...useCases, JwtModule],
})
export class UseCasesModule {}
