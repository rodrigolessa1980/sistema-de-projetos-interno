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
exports.GetCompanyByIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const not_found_exception_1 = require("../../domain/exceptions/not-found.exception");
const company_repository_interface_1 = require("../../domain/repositories/company-repository.interface");
let GetCompanyByIdUseCase = class GetCompanyByIdUseCase {
    companyRepository;
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(id) {
        const company = await this.companyRepository.findById(id);
        if (!company) {
            throw new not_found_exception_1.NotFoundException('Empresa', id);
        }
        return company;
    }
};
exports.GetCompanyByIdUseCase = GetCompanyByIdUseCase;
exports.GetCompanyByIdUseCase = GetCompanyByIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(company_repository_interface_1.ICompanyRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], GetCompanyByIdUseCase);
//# sourceMappingURL=get-company-by-id.use-case.js.map