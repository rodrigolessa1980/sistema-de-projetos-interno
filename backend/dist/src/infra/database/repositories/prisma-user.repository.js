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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_entity_1 = require("../../../core/domain/entities/user.entity");
let PrismaUserRepository = class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToDomain(raw) {
        return new user_entity_1.User({
            id: raw.id,
            name: raw.name,
            email: raw.email,
            passwordHash: raw.passwordHash,
            role: raw.role,
            avatar: raw.avatar,
            position: raw.position,
            department: raw.department,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    async findById(id) {
        const raw = await this.prisma.user.findUnique({ where: { id } });
        return raw ? this.mapToDomain(raw) : null;
    }
    async findByEmail(email) {
        const raw = await this.prisma.user.findUnique({ where: { email } });
        return raw ? this.mapToDomain(raw) : null;
    }
    async create(user) {
        const raw = await this.prisma.user.create({
            data: {
                id: user.id || undefined,
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                role: user.role,
                avatar: user.avatar,
                position: user.position,
                department: user.department,
            },
        });
        return this.mapToDomain(raw);
    }
    async update(user) {
        const raw = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                role: user.role,
                avatar: user.avatar,
                position: user.position,
                department: user.department,
            },
        });
        return this.mapToDomain(raw);
    }
    async delete(id) {
        await this.prisma.user.delete({ where: { id } });
    }
    async listAll() {
        const raws = await this.prisma.user.findMany();
        return raws.map((raw) => this.mapToDomain(raw));
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map