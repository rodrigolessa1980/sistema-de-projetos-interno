"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const list_companies_use_case_1 = require("../../../core/use-cases/companies/list-companies.use-case");
const get_company_by_id_use_case_1 = require("../../../core/use-cases/companies/get-company-by-id.use-case");
const create_company_use_case_1 = require("../../../core/use-cases/companies/create-company.use-case");
const update_company_use_case_1 = require("../../../core/use-cases/companies/update-company.use-case");
const delete_company_use_case_1 = require("../../../core/use-cases/companies/delete-company.use-case");
const create_company_dto_1 = require("../dtos/companies/create-company.dto");
const update_company_dto_1 = require("../dtos/companies/update-company.dto");
const company_presenter_1 = require("../presenters/company.presenter");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let CompaniesController = class CompaniesController {
    listCompaniesUseCase;
    getCompanyByIdUseCase;
    createCompanyUseCase;
    updateCompanyUseCase;
    deleteCompanyUseCase;
    constructor(listCompaniesUseCase, getCompanyByIdUseCase, createCompanyUseCase, updateCompanyUseCase, deleteCompanyUseCase) {
        this.listCompaniesUseCase = listCompaniesUseCase;
        this.getCompanyByIdUseCase = getCompanyByIdUseCase;
        this.createCompanyUseCase = createCompanyUseCase;
        this.updateCompanyUseCase = updateCompanyUseCase;
        this.deleteCompanyUseCase = deleteCompanyUseCase;
    }
    async list() {
        const companies = await this.listCompaniesUseCase.execute();
        return { companies: companies.map(company_presenter_1.CompanyPresenter.toHTTP) };
    }
    async getById(id) {
        const company = await this.getCompanyByIdUseCase.execute(id);
        return { company: company_presenter_1.CompanyPresenter.toHTTP(company) };
    }
    async create(body) {
        const company = await this.createCompanyUseCase.execute(body);
        return { company: company_presenter_1.CompanyPresenter.toHTTP(company) };
    }
    async update(id, body) {
        const company = await this.updateCompanyUseCase.execute({ id, ...body });
        return { company: company_presenter_1.CompanyPresenter.toHTTP(company) };
    }
    async delete(id) {
        await this.deleteCompanyUseCase.execute(id);
        return { success: true };
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "delete", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)('companies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [list_companies_use_case_1.ListCompaniesUseCase,
        get_company_by_id_use_case_1.GetCompanyByIdUseCase,
        create_company_use_case_1.CreateCompanyUseCase,
        update_company_use_case_1.UpdateCompanyUseCase,
        delete_company_use_case_1.DeleteCompanyUseCase])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map