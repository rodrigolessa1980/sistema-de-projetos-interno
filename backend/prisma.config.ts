import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { buildMysqlConnectionString } from './src/infra/config/mysql.config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    url: buildMysqlConnectionString(),
  },
});
