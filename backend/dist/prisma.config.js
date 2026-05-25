"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
const mysql_config_1 = require("./src/infra/config/mysql.config");
exports.default = (0, config_1.defineConfig)({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
    datasource: {
        url: (0, mysql_config_1.buildMysqlConnectionString)(),
    },
});
//# sourceMappingURL=prisma.config.js.map