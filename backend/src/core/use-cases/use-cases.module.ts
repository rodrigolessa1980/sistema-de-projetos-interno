import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginUseCase } from './auth/login.use-case';
import { GetCurrentUserUseCase } from './auth/get-current-user.use-case';
import { ListCompaniesUseCase } from './companies/list-companies.use-case';
import { GetCompanyByIdUseCase } from './companies/get-company-by-id.use-case';
import { CreateCompanyUseCase } from './companies/create-company.use-case';
import { UpdateCompanyUseCase } from './companies/update-company.use-case';
import { DeleteCompanyUseCase } from './companies/delete-company.use-case';

const useCases = [
  LoginUseCase,
  GetCurrentUserUseCase,
  ListCompaniesUseCase,
  GetCompanyByIdUseCase,
  CreateCompanyUseCase,
  UpdateCompanyUseCase,
  DeleteCompanyUseCase,
];

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'devflow-jwt-secret-change-in-production'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [...useCases],
  exports: [...useCases, JwtModule],
})
export class UseCasesModule {}
