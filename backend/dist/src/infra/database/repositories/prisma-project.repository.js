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
exports.PrismaProjectRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const project_entity_1 = require("../../../core/domain/entities/project.entity");
const enums_1 = require("../../../core/domain/entities/enums");
let PrismaProjectRepository = class PrismaProjectRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToDomain(raw) {
        return new project_entity_1.Project({
            id: raw.id,
            companyId: raw.companyId,
            name: raw.name,
            description: raw.description,
            status: raw.status,
            ownerId: raw.ownerId,
            startDate: raw.startDate,
            endDate: raw.endDate,
            estimatedHours: raw.estimatedHours,
            actualHours: Number(raw.actualHours),
            progress: raw.progress,
            color: raw.color,
            avatar: raw.avatar,
            testUrl: raw.testUrl,
            queueOrder: raw.queueOrder,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    async findById(id) {
        const raw = await this.prisma.project.findUnique({ where: { id } });
        return raw ? this.mapToDomain(raw) : null;
    }
    async create(project) {
        const raw = await this.prisma.project.create({
            data: {
                id: project.id || undefined,
                companyId: project.companyId,
                name: project.name,
                description: project.description,
                status: project.status,
                ownerId: project.ownerId,
                startDate: project.startDate,
                endDate: project.endDate,
                estimatedHours: project.estimatedHours,
                actualHours: project.actualHours,
                progress: project.progress,
                color: project.color,
                avatar: project.avatar,
                testUrl: project.testUrl,
                queueOrder: project.queueOrder,
            },
        });
        return this.mapToDomain(raw);
    }
    async update(project) {
        const raw = await this.prisma.project.update({
            where: { id: project.id },
            data: {
                name: project.name,
                description: project.description,
                status: project.status,
                ownerId: project.ownerId,
                startDate: project.startDate,
                endDate: project.endDate,
                estimatedHours: project.estimatedHours,
                actualHours: project.actualHours,
                progress: project.progress,
                color: project.color,
                avatar: project.avatar,
                testUrl: project.testUrl,
                queueOrder: project.queueOrder,
            },
        });
        return this.mapToDomain(raw);
    }
    async delete(id) {
        await this.prisma.project.delete({ where: { id } });
    }
    async listAll() {
        const raws = await this.prisma.project.findMany();
        return raws.map((raw) => this.mapToDomain(raw));
    }
    async findByCompanyId(companyId) {
        const raws = await this.prisma.project.findMany({ where: { companyId } });
        return raws.map((raw) => this.mapToDomain(raw));
    }
    async getQueuedProjects() {
        const raws = await this.prisma.project.findMany({
            where: {
                queueOrder: { not: null },
                status: { notIn: [enums_1.ProjectStatus.CONCLUIDO, enums_1.ProjectStatus.CANCELADO] },
            },
            orderBy: { queueOrder: 'asc' },
        });
        return raws.map((raw) => this.mapToDomain(raw));
    }
    async updateQueueOrder(orderedIds) {
        await this.prisma.$transaction(orderedIds.map((id, index) => this.prisma.project.update({
            where: { id },
            data: { queueOrder: index + 1 },
        })));
    }
};
exports.PrismaProjectRepository = PrismaProjectRepository;
exports.PrismaProjectRepository = PrismaProjectRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProjectRepository);
//# sourceMappingURL=prisma-project.repository.js.map