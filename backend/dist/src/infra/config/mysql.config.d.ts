import { PrismaMariaDb } from '@prisma/adapter-mariadb';
export interface MysqlConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
export declare function getMysqlConfig(): MysqlConfig;
export declare function buildMysqlConnectionString(config?: MysqlConfig): string;
export declare function createPrismaMariaDbAdapter(config?: MysqlConfig): PrismaMariaDb;
