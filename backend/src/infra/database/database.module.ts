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
import { IEpicRepositoryToken } from '../../core/domain/repositories/epic-repository.interface';
import { PrismaEpicRepository } from './repositories/prisma-epic.repository';

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
    { provide: IEpicRepositoryToken, useClass: PrismaEpicRepository },
  ],
  exports: [
    IUserRepositoryToken,
    ICompanyRepositoryToken,
    IProjectRepositoryToken,
    ITaskRepositoryToken,
    ITimeLogRepositoryToken,
    IUserPermissionRepositoryToken,
    IModuleRepositoryToken,
    IEpicRepositoryToken,
  ],
})
export class DatabaseModule {}
