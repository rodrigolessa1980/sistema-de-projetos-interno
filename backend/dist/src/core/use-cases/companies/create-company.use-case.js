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
exports.CreateCompanyUseCase = void 0;
const common_1 = require("@nestjs/common");
const company_entity_1 = require("../../domain/entities/company.entity");
const company_repository_interface_1 = require("../../domain/repositories/company-repository.interface");
let CreateCompanyUseCase = class CreateCompanyUseCase {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(input) {
        const company = new company_entity_1.Company({
            name: input.name.trim(),
            shortName: input.shortName.trim().toUpperCase(),
            color: input.color?.trim() || '#6366f1',
            cnpj: input.cnpj?.trim() || null,
        });
        return this.companyRepository.create(company);
    }
};
exports.CreateCompanyUseCase = CreateCompanyUseCase;
exports.CreateCompanyUseCase = CreateCompanyUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(company_repository_interface_1.ICompanyRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], CreateCompanyUseCase);
//# sourceMappingURL=create-company.use-case.js.map