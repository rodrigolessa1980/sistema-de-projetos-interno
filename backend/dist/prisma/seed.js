"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("../src/generated/prisma/client");
const mysql_config_1 = require("../src/infra/config/mysql.config");
const prisma = new client_1.PrismaClient({
    adapter: (0, mysql_config_1.createPrismaMariaDbAdapter)(),
});
async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@devflow.com' },
        update: {},
        create: {
            name: 'Rafael Monteiro',
            email: 'admin@devflow.com',
            passwordHash,
            role: client_1.UserRole.ADMIN,
            position: 'CTO',
            department: 'Tecnologia',
            avatar: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f98a.png',
        },
    });
    const devPassword = await bcrypt.hash('dev123', 10);
    const developers = [
        {
            name: 'Ana Carolina Silva',
            email: 'ana@devflow.com',
            position: 'Senior Frontend Developer',
            department: 'Engenharia',
        },
        {
            name: 'Lucas Ferreira',
            email: 'lucas@devflow.com',
            position: 'Backend Engineer',
            department: 'Engenharia',
        },
        {
            name: 'Fernanda Lima',
            email: 'fernanda@devflow.com',
            position: 'Full Stack Developer',
            department: 'Engenharia',
        },
    ];
    for (const dev of developers) {
        await prisma.user.upsert({
            where: { email: dev.email },
            update: {},
            create: {
                ...dev,
                passwordHash: devPassword,
                role: client_1.UserRole.DEVELOPER,
            },
        });
    }
    const companies = [
        { name: 'Monkey Tech', shortName: 'MKT', color: '#8B5CF6', cnpj: null },
        { name: 'Cliente Alpha', shortName: 'ALP', color: '#3B82F6', cnpj: null },
        { name: 'Cliente Beta', shortName: 'BET', color: '#10B981', cnpj: null },
    ];
    for (const company of companies) {
        const existing = await prisma.company.findFirst({
            where: { shortName: company.shortName },
        });
        if (!existing) {
            await prisma.company.create({ data: company });
        }
    }
    console.log('Seed concluído: usuários e empresas iniciais criados.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map