import { Module } from '@nestjs/common';
import { UseCasesModule } from '../../core/use-cases/use-cases.module';
import { AuthController } from './controllers/auth.controller';
import { CompaniesController } from './controllers/companies.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [HealthController, AuthController, CompaniesController],
})
export class HttpModule {}
