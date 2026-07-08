import { Tenant } from '../entities/tenant.entity';

export interface ITenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  listActive(): Promise<Tenant[]>;
}
export const ITenantRepositoryToken = Symbol('ITenantRepository');
