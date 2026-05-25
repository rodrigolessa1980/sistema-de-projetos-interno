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
exports.PrismaTaskRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const task_entity_1 = require("../../../core/domain/entities/task.entity");
let PrismaTaskRepository = class PrismaTaskRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToDomain(raw) {
        return new task_entity_1.Task({
            id: raw.id,
            projectId: raw.projectId,
            moduleId: raw.moduleId,
            epicId: raw.epicId,
            parentTaskId: raw.parentTaskId,
            title: raw.title,
            description: raw.description,
            status: raw.status,
            complexity: raw.complexity,
            assigneeId: raw.assigneeId,
            reporterId: raw.reporterId,
            estimatedHours: raw.estimatedHours,
            actualHours: Number(raw.actualHours),
            startDate: raw.startDate,
            dueDate: raw.dueDate,
            completedAt: raw.completedAt,
            blockedReason: raw.blockedReason,
            isUrgent: raw.isUrgent,
            urgentBlockedById: raw.urgentBlockedById,
            urgentPreviousStatus: raw.urgentPreviousStatus,
            order: raw.order,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    async findById(id) {
        const raw = await this.prisma.task.findUnique({ where: { id } });
        return raw ? this.mapToDomain(raw) : null;
    }
    async create(task) {
        const raw = await this.prisma.task.create({
            data: {
                id: task.id || undefined,
                projectId: task.projectId,
                moduleId: task.moduleId,
                epicId: task.epicId,
                parentTaskId: task.parentTaskId,
                title: task.title,
                description: task.description,
                status: task.status,
                complexity: task.complexity,
                assigneeId: task.assigneeId,
                reporterId: task.reporterId,
                estimatedHours: task.estimatedHours,
                actualHours: task.actualHours,
                startDate: task.startDate,
                dueDate: task.dueDate,
                completedAt: task.completedAt,
                blockedReason: task.blockedReason,
                isUrgent: task.isUrgent,
                urgentBlockedById: task.urgentBlockedById,
                urgentPreviousStatus: task.urgentPreviousStatus,
                order: task.order,
            },
        });
        return this.mapToDomain(raw);
    }
    async update(task) {
        const raw = await this.prisma.task.update({
            where: { id: task.id },
            data: {
                projectId: task.projectId,
                moduleId: task.moduleId,
                epicId: task.epicId,
                parentTaskId: task.parentTaskId,
                title: task.title,
                description: task.description,
                status: task.status,
                complexity: task.complexity,
                assigneeId: task.assigneeId,
                reporterId: task.reporterId,
                estimatedHours: task.estimatedHours,
                actualHours: task.actualHours,
                startDate: task.startDate,
                dueDate: task.dueDate,
                completedAt: task.completedAt,
                blockedReason: task.blockedReason,
                isUrgent: task.isUrgent,
                urgentBlockedById: task.urgentBlockedById,
                urgentPreviousStatus: task.urgentPreviousStatus,
                order: task.order,
            },
        });
        return this.mapToDomain(raw);
    }
    async delete(id) {
        await this.prisma.task.delete({ where: { id } });
    }
    async findByAssignee(assigneeId) {
        const raws = await this.prisma.task.findMany({ where: { assigneeId } });
        return raws.map((raw) => this.mapToDomain(raw));
    }
    async findByProjectId(projectId) {
        const raws = await this.prisma.task.findMany({ where: { projectId } });
        return raws.map((raw) => this.mapToDomain(raw));
    }
    async setTaskUrgent(id, isUrgent) {
        await this.prisma.task.update({
            where: { id },
            data: { isUrgent },
        });
    }
};
exports.PrismaTaskRepository = PrismaTaskRepository;
exports.PrismaTaskRepository = PrismaTaskRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaTaskRepository);
//# sourceMappingURL=prisma-task.repository.js.map