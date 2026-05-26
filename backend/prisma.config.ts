import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import { buildMysqlConnectionString } from './src/infra/config/mysql.config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npm run prisma:seed:run',
  },
  datasource: {
    url: buildMysqlConnectionString(),
  },
});
