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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCompanyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const company_entity_1 = require("../../../core/domain/entities/company.entity");
let PrismaCompanyRepository = class PrismaCompanyRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToDomain(raw) {
        return new company_entity_1.Company({
            id: raw.id,
            name: raw.name,
            shortName: raw.shortName,
            color: raw.color,
            cnpj: raw.cnpj,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    async findById(id) {
        const raw = await this.prisma.company.findUnique({ where: { id } });
        return raw ? this.mapToDomain(raw) : null;
    }
    async create(company) {
        const raw = await this.prisma.company.create({
            data: {
                id: company.id || undefined,
                name: company.name,
                shortName: company.shortName,
                color: company.color,
                cnpj: company.cnpj,
            },
        });
        return this.mapToDomain(raw);
    }
    async update(company) {
        const raw = await this.prisma.company.update({
            where: { id: company.id },
            data: {
                name: company.name,
                shortName: company.shortName,
                color: company.color,
                cnpj: company.cnpj,
            },
        });
        return this.mapToDomain(raw);
    }
    async delete(id) {
        await this.prisma.company.delete({ where: { id } });
    }
    async listAll() {
        const raws = await this.prisma.company.findMany();
        return raws.map((raw) => this.mapToDomain(raw));
    }
};
exports.PrismaCompanyRepository = PrismaCompanyRepository;
exports.PrismaCompanyRepository = PrismaCompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCompanyRepository);
//# sourceMappingURL=prisma-company.repository.js.map