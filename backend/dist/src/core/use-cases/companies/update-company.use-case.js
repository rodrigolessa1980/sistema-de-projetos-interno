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
exports.UpdateCompanyUseCase = void 0;
const common_1 = require("@nestjs/common");
const company_entity_1 = require("../../domain/entities/company.entity");
const not_found_exception_1 = require("../../domain/exceptions/not-found.exception");
const company_repository_interface_1 = require("../../domain/repositories/company-repository.interface");
let UpdateCompanyUseCase = class UpdateCompanyUseCase {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(input) {
        const existing = await this.companyRepository.findById(input.id);
        if (!existing) {
            throw new not_found_exception_1.NotFoundException('Empresa', input.id);
        }
        const company = new company_entity_1.Company({
            id: existing.id,
            name: input.name?.trim() ?? existing.name,
            shortName: input.shortName?.trim().toUpperCase() ?? existing.shortName,
            color: input.color?.trim() ?? existing.color,
            cnpj: input.cnpj !== undefined ? (input.cnpj?.trim() || null) : existing.cnpj,
            createdAt: existing.createdAt,
        });
        return this.companyRepository.update(company);
    }
};
exports.UpdateCompanyUseCase = UpdateCompanyUseCase;
exports.UpdateCompanyUseCase = UpdateCompanyUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(company_repository_interface_1.ICompanyRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], UpdateCompanyUseCase);
//# sourceMappingURL=update-company.use-case.js.map