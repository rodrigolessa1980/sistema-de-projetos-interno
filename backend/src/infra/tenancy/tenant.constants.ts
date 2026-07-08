/** UUIDs fixos dos tenants (devem casar com a migration e o seed). */
export const TENANT_IDS = {
  DESENVOLVIMENTO: '00000000-0000-4000-a000-000000000001',
  MARKETING: '00000000-0000-4000-a000-000000000002',
} as const;

export const TENANT_SLUGS = {
  DESENVOLVIMENTO: 'desenvolvimento',
  MARKETING: 'marketing',
} as const;
