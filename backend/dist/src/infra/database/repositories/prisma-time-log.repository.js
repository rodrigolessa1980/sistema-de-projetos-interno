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
exports.PrismaTimeLogRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const time_log_entity_1 = require("../../../core/domain/entities/time-log.entity");
let PrismaTimeLogRepository = class PrismaTimeLogRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToDomain(raw) {
        return new time_log_entity_1.TimeLog({
            id: raw.id,
            projectId: raw.projectId,
            taskId: raw.taskId,
            userId: raw.userId,
            hours: Number(raw.hours),
            durationSeconds: raw.durationSeconds,
            description: raw.description,
            date: raw.date,
            startedAt: raw.startedAt,
            endedAt: raw.endedAt,
            source: raw.source,
            status: raw.status,
            createdAt: raw.createdAt,
        });
    }
    async findById(id) {
        const raw = await this.prisma.timeLog.findUnique({ where: { id } });
        return raw ? this.mapToDomain(raw) : null;
    }
    async create(timeLog) {
        const raw = await this.prisma.timeLog.create({
            data: {
                id: timeLog.id || undefined,
                projectId: timeLog.projectId,
                taskId: timeLog.taskId,
                userId: timeLog.userId,
                hours: timeLog.hours,
                durationSeconds: timeLog.durationSeconds,
                description: timeLog.description,
                date: timeLog.date,
                startedAt: timeLog.startedAt,
                endedAt: timeLog.endedAt,
                source: timeLog.source,
                status: timeLog.status,
            },
        });
        return this.mapToDomain(raw);
    }
    async delete(id) {
        await this.prisma.timeLog.delete({ where: { id } });
    }
    async findByTaskId(taskId) {
        const raws = await this.prisma.timeLog.findMany({ where: { taskId } });
        return raws.map((raw) => this.mapToDomain(raw));
    }
    async findByUserId(userId) {
        const raws = await this.prisma.timeLog.findMany({ where: { userId } });
        return raws.map((raw) => this.mapToDomain(raw));
    }
    async findActiveSessionByUserId(userId) {
        return null;
    }
};
exports.PrismaTimeLogRepository = PrismaTimeLogRepository;
exports.PrismaTimeLogRepository = PrismaTimeLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaTimeLogRepository);
//# sourceMappingURL=prisma-time-log.repository.js.map