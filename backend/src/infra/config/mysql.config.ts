import { PrismaMariaDb } from '@prisma/adapter-mariadb';

export interface MysqlConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const MYSQL_ENV_KEYS = [
  'MYSQL_HOST',
  'MYSQL_PORT',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
] as const;

export function getMysqlConfig(): MysqlConfig {
  const host = process.env.MYSQL_HOST;
  const port = process.env.MYSQL_PORT;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  const missing = MYSQL_ENV_KEYS.filter((key) => {
    const value = process.env[key];
    return value === undefined || value === '';
  });

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de conexão MySQL ausentes: ${missing.join(', ')}. Copie .env.example para .env e preencha os valores.`,
    );
  }

  const parsedPort = Number(port);
  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error(`MYSQL_PORT inválida: "${port}". Use um número inteiro positivo.`);
  }

  return {
    host: host!,
    port: parsedPort,
    user: user!,
    password: password!,
    database: database!,
  };
}

/** URL usada pelo Prisma CLI (migrate, db push, etc.) */
export function buildMysqlConnectionString(config: MysqlConfig = getMysqlConfig()): string {
  const user = encodeURIComponent(config.user);
  const password = encodeURIComponent(config.password);
  return `mysql://${user}:${password}@${config.host}:${config.port}/${config.database}`;
}

export function createPrismaMariaDbAdapter(config: MysqlConfig = getMysqlConfig()): PrismaMariaDb {
  return new PrismaMariaDb({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectTimeout: 10000,
    acquireTimeout: 30000,
  });
}
