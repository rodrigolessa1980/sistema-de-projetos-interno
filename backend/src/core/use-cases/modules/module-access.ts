import { ForbiddenException } from '@nestjs/common';
import { Module } from '../../domain/entities/module.entity';
import { UserRole } from '../../domain/entities/enums';

/**
 * Regra "admin ou dono": só o admin ou quem criou o módulo (createdById) pode
 * editá-lo/excluí-lo. Módulos antigos sem dono (createdById null) só o admin.
 */
export function assertCanModifyModule(
  module: Module,
  requesterId: string,
  requesterRole: UserRole,
): void {
  if (requesterRole === UserRole.ADMIN) return;
  if (module.createdById && module.createdById === requesterId) return;
  throw new ForbiddenException('Você só pode alterar módulos que você criou.');
}
