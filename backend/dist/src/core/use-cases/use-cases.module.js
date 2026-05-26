"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCasesModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const login_use_case_1 = require("./auth/login.use-case");
const get_current_user_use_case_1 = require("./auth/get-current-user.use-case");
const list_companies_use_case_1 = require("./companies/list-companies.use-case");
const get_company_by_id_use_case_1 = require("./companies/get-company-by-id.use-case");
const create_company_use_case_1 = require("./companies/create-company.use-case");
const update_company_use_case_1 = require("./companies/update-company.use-case");
const delete_company_use_case_1 = require("./companies/delete-company.use-case");
const reorder_kanban_tasks_use_case_1 = require("./tasks/reorder-kanban-tasks.use-case");
const useCases = [
    login_use_case_1.LoginUseCase,
    get_current_user_use_case_1.GetCurrentUserUseCase,
    list_companies_use_case_1.ListCompaniesUseCase,
    get_company_by_id_use_case_1.GetCompanyByIdUseCase,
    create_company_use_case_1.CreateCompanyUseCase,
    update_company_use_case_1.UpdateCompanyUseCase,
    delete_company_use_case_1.DeleteCompanyUseCase,
    reorder_kanban_tasks_use_case_1.ReorderKanbanTasksUseCase,
];
let UseCasesModule = class UseCasesModule {
};
exports.UseCasesModule = UseCasesModule;
exports.UseCasesModule = UseCasesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET', 'devflow-jwt-secret-change-in-production'),
                    signOptions: { expiresIn: '24h' },
                }),
            }),
        ],
        providers: [...useCases],
        exports: [...useCases, jwt_1.JwtModule],
    })
], UseCasesModule);
//# sourceMappingURL=use-cases.module.js.map