export const PERMISSION_MODULES = [
  'projects',
  'modules',
  'epics',
  'tasks',
  'users',
  'timelogs',
  'comments',
  'metrics',
  'audit',
] as const;

export const PERMISSION_ACTIONS = ['read', 'create', 'update', 'delete'] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
export type PermissionKey = `${PermissionModule}:${PermissionAction}`;

export const DEFAULT_DEVELOPER_PERMISSIONS: PermissionKey[] = [
  'projects:read',
  'modules:read',
  'epics:read',
  'tasks:read',
  'tasks:update',
  'timelogs:create',
  'timelogs:read',
  'comments:create',
  'comments:read',
];

export const ALL_PERMISSIONS: PermissionKey[] = PERMISSION_MODULES.flatMap((module) =>
  PERMISSION_ACTIONS.map((action) => `${module}:${action}` as PermissionKey),
);

export function isPermissionKey(value: string): value is PermissionKey {
  const [module, action] = value.split(':');
  return (
    PERMISSION_MODULES.includes(module as PermissionModule) &&
    PERMISSION_ACTIONS.includes(action as PermissionAction)
  );
}

export function parsePermissionKey(value: string): PermissionKey {
  if (!isPermissionKey(value)) {
    throw new Error(`Permissão inválida: "${value}"`);
  }
  return value;
}
