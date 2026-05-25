"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const domain_exception_filter_1 = require("./infra/http/filters/domain-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new domain_exception_filter_1.DomainExceptionFilter());
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`DevFlow API rodando em http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map