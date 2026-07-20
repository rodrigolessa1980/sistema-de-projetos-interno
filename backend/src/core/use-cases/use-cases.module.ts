import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Auth Use Cases
import { LoginUseCase } from './auth/login.use-case';
import { RegisterUseCase } from './auth/register.use-case';
import { GetCurrentUserUseCase } from './auth/get-current-user.use-case';
import { ChangePasswordUseCase } from './auth/change-password.use-case';

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
import { CreateModuleWithTimeLogUseCase } from './modules/create-module-with-time-log.use-case';
import { UpdateModuleUseCase } from './modules/update-module.use-case';
import { DeleteModuleUseCase } from './modules/delete-module.use-case';
import { ListModulesByProjectUseCase } from './modules/list-modules-by-project.use-case';
import { ListModuleAttachmentsByProjectUseCase } from './modules/list-module-attachments-by-project.use-case';
import { CreateModuleAttachmentUseCase } from './modules/create-module-attachment.use-case';
import { DeleteModuleAttachmentUseCase } from './modules/delete-module-attachment.use-case';
import { CreateEpicUseCase } from './epics/create-epic.use-case';
import { UpdateEpicUseCase } from './epics/update-epic.use-case';
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
import { ReleaseUrgencyBlocksUseCase } from './tasks/release-urgency-blocks.use-case';
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
} from './tasks/comment.use-cases';
import {
  CreateSubtaskUseCase,
  UpdateSubtaskUseCase,
  DeleteSubtaskUseCase,
} from './tasks/subtask.use-cases';
import {
  CreateTaskDependencyUseCase,
  DeleteTaskDependencyUseCase,
} from './tasks/task-dependency.use-cases';
import {
  CreateTaskAttachmentUseCase,
  ListTaskAttachmentsUseCase,
  DeleteTaskAttachmentUseCase,
} from './tasks/task-attachment.use-cases';
import {
  CreateTaskNoteUseCase,
  UpdateTaskNoteUseCase,
  DeleteTaskNoteUseCase,
} from './tasks/task-note.use-cases';

// TimeLog Use Cases
import { CreateTimeLogUseCase } from './time-logs/create-time-log.use-case';
import { StartTimerUseCase } from './time-logs/start-timer.use-case';
import { StopTimerUseCase } from './time-logs/stop-timer.use-case';
import { GetActiveSessionUseCase } from './time-logs/get-active-session.use-case';
import { ListTimeLogsByTaskUseCase } from './time-logs/list-time-logs-by-task.use-case';
import { ListTimeLogsByUserUseCase } from './time-logs/list-time-logs-by-user.use-case';
import { ListTimeLogsByProjectUseCase } from './time-logs/list-time-logs-by-project.use-case';
import { ListAllTimeLogsUseCase } from './time-logs/list-all-time-logs.use-case';
import { DeleteTimeLogUseCase } from './time-logs/delete-time-log.use-case';

// User Use Cases
import { ListUsersUseCase } from './users/list-users.use-case';
import { GetUserPermissionsUseCase } from './users/get-user-permissions.use-case';
import { UpdateUserPermissionsUseCase } from './users/update-user-permissions.use-case';
import { ApproveUserUseCase } from './users/approve-user.use-case';
import { CreateUserUseCase } from './users/create-user.use-case';
import { UpdateUserUseCase } from './users/update-user.use-case';
import { DeleteUserUseCase } from './users/delete-user.use-case';
// Tenant Use Cases
import { ListTenantsUseCase } from './tenants/list-tenants.use-case';
import { CreateApiTokenUseCase } from './api-tokens/create-api-token.use-case';
import {
  ListApiTokensUseCase,
  RevokeApiTokenUseCase,
} from './api-tokens/manage-api-tokens.use-case';
import { PermissionService } from '../permissions/permission.service';
import { NotificationService } from '../services/notification.service';
import { AuditService } from '../services/audit.service';

const useCases = [
  // Auth
  LoginUseCase,
  RegisterUseCase,
  GetCurrentUserUseCase,
  ChangePasswordUseCase,


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
  CreateModuleWithTimeLogUseCase,
  UpdateModuleUseCase,
  DeleteModuleUseCase,
  ListModulesByProjectUseCase,
  ListModuleAttachmentsByProjectUseCase,
  CreateModuleAttachmentUseCase,
  DeleteModuleAttachmentUseCase,

  // Epics
  CreateEpicUseCase,
  UpdateEpicUseCase,
  ListEpicsByProjectUseCase,

  // Tasks
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
  ListTasksByProjectUseCase,
  ListTasksByAssigneeUseCase,
  SetTaskUrgentUseCase,
  ReleaseUrgencyBlocksUseCase,
  ReorderKanbanTasksUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateSubtaskUseCase,
  UpdateSubtaskUseCase,
  DeleteSubtaskUseCase,
  CreateTaskDependencyUseCase,
  DeleteTaskDependencyUseCase,
  CreateTaskAttachmentUseCase,
  ListTaskAttachmentsUseCase,
  DeleteTaskAttachmentUseCase,
  CreateTaskNoteUseCase,
  UpdateTaskNoteUseCase,
  DeleteTaskNoteUseCase,

  // TimeLogs
  CreateTimeLogUseCase,
  StartTimerUseCase,
  StopTimerUseCase,
  GetActiveSessionUseCase,
  ListTimeLogsByTaskUseCase,
  ListTimeLogsByUserUseCase,
  ListTimeLogsByProjectUseCase,
  ListAllTimeLogsUseCase,
  DeleteTimeLogUseCase,

  // Users & Permissions
  ListUsersUseCase,
  GetUserPermissionsUseCase,
  UpdateUserPermissionsUseCase,
  ApproveUserUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  // Tenants
  ListTenantsUseCase,
  CreateApiTokenUseCase,
  ListApiTokensUseCase,
  RevokeApiTokenUseCase,
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
  providers: [...useCases, PermissionService, NotificationService, AuditService],
  exports: [...useCases, JwtModule, PermissionService, NotificationService, AuditService],
})
export class UseCasesModule {}
