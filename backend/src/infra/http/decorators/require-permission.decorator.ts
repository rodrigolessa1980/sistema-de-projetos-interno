import { SetMetadata } from '@nestjs/common';
import type { PermissionKey } from '../../../core/permissions/permission-keys';

export const PERMISSION_KEY = 'required_permission';

export const RequirePermission = (permission: PermissionKey) =>
  SetMetadata(PERMISSION_KEY, permission);

export const REQUIRE_ADMIN_KEY = 'require_admin';

export const RequireAdmin = () => SetMetadata(REQUIRE_ADMIN_KEY, true);
