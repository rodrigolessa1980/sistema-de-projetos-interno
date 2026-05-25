import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ListCompaniesUseCase } from '../../../core/use-cases/companies/list-companies.use-case';
import { GetCompanyByIdUseCase } from '../../../core/use-cases/companies/get-company-by-id.use-case';
import { CreateCompanyUseCase } from '../../../core/use-cases/companies/create-company.use-case';
import { UpdateCompanyUseCase } from '../../../core/use-cases/companies/update-company.use-case';
import { DeleteCompanyUseCase } from '../../../core/use-cases/companies/delete-company.use-case';
import { CreateCompanyDto } from '../dtos/companies/create-company.dto';
import { UpdateCompanyDto } from '../dtos/companies/update-company.dto';
import { CompanyPresenter } from '../presenters/company.presenter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
    private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
  ) {}

  @Get()
  async list() {
    const companies = await this.listCompaniesUseCase.execute();
    return { companies: companies.map(CompanyPresenter.toHTTP) };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const company = await this.getCompanyByIdUseCase.execute(id);
    return { company: CompanyPresenter.toHTTP(company) };
  }

  @Post()
  async create(@Body() body: CreateCompanyDto) {
    const company = await this.createCompanyUseCase.execute(body);
    return { company: CompanyPresenter.toHTTP(company) };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCompanyDto) {
    const company = await this.updateCompanyUseCase.execute({ id, ...body });
    return { company: CompanyPresenter.toHTTP(company) };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteCompanyUseCase.execute(id);
    return { success: true };
  }
}
