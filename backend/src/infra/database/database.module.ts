import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IUserRepositoryToken } from '../../core/domain/repositories/user-repository.interface';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { ICompanyRepositoryToken } from '../../core/domain/repositories/company-repository.interface';
import { PrismaCompanyRepository } from './repositories/prisma-company.repository';
import { IProjectRepositoryToken } from '../../core/domain/repositories/project-repository.interface';
import { PrismaProjectRepository } from './repositories/prisma-project.repository';
import { ITaskRepositoryToken } from '../../core/domain/repositories/task-repository.interface';
import { PrismaTaskRepository } from './repositories/prisma-task.repository';
import { ITimeLogRepositoryToken } from '../../core/domain/repositories/time-log-repository.interface';
import { PrismaTimeLogRepository } from './repositories/prisma-time-log.repository';
import { IUserPermissionRepositoryToken } from '../../core/domain/repositories/user-permission-repository.interface';
import { PrismaUserPermissionRepository } from './repositories/prisma-user-permission.repository';
import { IModuleRepositoryToken } from '../../core/domain/repositories/module-repository.interface';
import { PrismaModuleRepository } from './repositories/prisma-module.repository';
import { IModuleAttachmentRepositoryToken } from '../../core/domain/repositories/module-attachment-repository.interface';
import { PrismaModuleAttachmentRepository } from './repositories/prisma-module-attachment.repository';
import { IEpicRepositoryToken } from '../../core/domain/repositories/epic-repository.interface';
import { PrismaEpicRepository } from './repositories/prisma-epic.repository';
import { IApiTokenRepositoryToken } from '../../core/domain/repositories/api-token-repository.interface';
import { PrismaApiTokenRepository } from './repositories/prisma-api-token.repository';
import { ITenantRepositoryToken } from '../../core/domain/repositories/tenant-repository.interface';
import { PrismaTenantRepository } from './repositories/prisma-tenant.repository';
import { ICommentRepositoryToken } from '../../core/domain/repositories/comment-repository.interface';
import { PrismaCommentRepository } from './repositories/prisma-comment.repository';
import { ISubtaskRepositoryToken } from '../../core/domain/repositories/subtask-repository.interface';
import { PrismaSubtaskRepository } from './repositories/prisma-subtask.repository';
import { ITaskDependencyRepositoryToken } from '../../core/domain/repositories/task-dependency-repository.interface';
import { PrismaTaskDependencyRepository } from './repositories/prisma-task-dependency.repository';
import { ITaskAttachmentRepositoryToken } from '../../core/domain/repositories/task-attachment-repository.interface';
import { PrismaTaskAttachmentRepository } from './repositories/prisma-task-attachment.repository';
import { ITaskNoteRepositoryToken } from '../../core/domain/repositories/task-note-repository.interface';
import { PrismaTaskNoteRepository } from './repositories/prisma-task-note.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    { provide: IUserRepositoryToken, useClass: PrismaUserRepository },
    { provide: ICompanyRepositoryToken, useClass: PrismaCompanyRepository },
    { provide: IProjectRepositoryToken, useClass: PrismaProjectRepository },
    { provide: ITaskRepositoryToken, useClass: PrismaTaskRepository },
    { provide: ITimeLogRepositoryToken, useClass: PrismaTimeLogRepository },
    { provide: IUserPermissionRepositoryToken, useClass: PrismaUserPermissionRepository },
    { provide: IModuleRepositoryToken, useClass: PrismaModuleRepository },
    { provide: IModuleAttachmentRepositoryToken, useClass: PrismaModuleAttachmentRepository },
    { provide: IEpicRepositoryToken, useClass: PrismaEpicRepository },
    { provide: IApiTokenRepositoryToken, useClass: PrismaApiTokenRepository },
    { provide: ITenantRepositoryToken, useClass: PrismaTenantRepository },
    { provide: ICommentRepositoryToken, useClass: PrismaCommentRepository },
    { provide: ISubtaskRepositoryToken, useClass: PrismaSubtaskRepository },
    { provide: ITaskDependencyRepositoryToken, useClass: PrismaTaskDependencyRepository },
    { provide: ITaskAttachmentRepositoryToken, useClass: PrismaTaskAttachmentRepository },
    { provide: ITaskNoteRepositoryToken, useClass: PrismaTaskNoteRepository },
  ],
  exports: [
    IUserRepositoryToken,
    ICompanyRepositoryToken,
    IProjectRepositoryToken,
    ITaskRepositoryToken,
    ITimeLogRepositoryToken,
    IUserPermissionRepositoryToken,
    IModuleRepositoryToken,
    IModuleAttachmentRepositoryToken,
    IEpicRepositoryToken,
    IApiTokenRepositoryToken,
    ITenantRepositoryToken,
    ICommentRepositoryToken,
    ISubtaskRepositoryToken,
    ITaskDependencyRepositoryToken,
    ITaskAttachmentRepositoryToken,
    ITaskNoteRepositoryToken,
  ],
})
export class DatabaseModule {}
