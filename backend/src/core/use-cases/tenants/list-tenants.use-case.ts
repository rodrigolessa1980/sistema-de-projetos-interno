import { Inject, Injectable } from '@nestjs/common';
import type { ITenantRepository } from '../../domain/repositories/tenant-repository.interface';
import { ITenantRepositoryToken } from '../../domain/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/entities/tenant.entity';

@Injectable()
export class ListTenantsUseCase {
  constructor(
    @Inject(ITenantRepositoryToken)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(): Promise<Tenant[]> {
    return this.tenantRepository.listActive();
  }
}
