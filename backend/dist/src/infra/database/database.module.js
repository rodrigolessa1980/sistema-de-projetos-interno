"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const user_repository_interface_1 = require("../../core/domain/repositories/user-repository.interface");
const prisma_user_repository_1 = require("./repositories/prisma-user.repository");
const company_repository_interface_1 = require("../../core/domain/repositories/company-repository.interface");
const prisma_company_repository_1 = require("./repositories/prisma-company.repository");
const project_repository_interface_1 = require("../../core/domain/repositories/project-repository.interface");
const prisma_project_repository_1 = require("./repositories/prisma-project.repository");
const task_repository_interface_1 = require("../../core/domain/repositories/task-repository.interface");
const prisma_task_repository_1 = require("./repositories/prisma-task.repository");
const time_log_repository_interface_1 = require("../../core/domain/repositories/time-log-repository.interface");
const prisma_time_log_repository_1 = require("./repositories/prisma-time-log.repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [
            {
                provide: user_repository_interface_1.IUserRepositoryToken,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            {
                provide: company_repository_interface_1.ICompanyRepositoryToken,
                useClass: prisma_company_repository_1.PrismaCompanyRepository,
            },
            {
                provide: project_repository_interface_1.IProjectRepositoryToken,
                useClass: prisma_project_repository_1.PrismaProjectRepository,
            },
            {
                provide: task_repository_interface_1.ITaskRepositoryToken,
                useClass: prisma_task_repository_1.PrismaTaskRepository,
            },
            {
                provide: time_log_repository_interface_1.ITimeLogRepositoryToken,
                useClass: prisma_time_log_repository_1.PrismaTimeLogRepository,
            },
        ],
        exports: [
            user_repository_interface_1.IUserRepositoryToken,
            company_repository_interface_1.ICompanyRepositoryToken,
            project_repository_interface_1.IProjectRepositoryToken,
            task_repository_interface_1.ITaskRepositoryToken,
            time_log_repository_interface_1.ITimeLogRepositoryToken,
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map