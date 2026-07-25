import { ForbiddenException } from '@nestjs/common';
import { Project } from '../../domain/entities/project.entity';
import { UserRole } from '../../domain/entities/enums';

/**
 * Regra "admin ou dono": só o admin ou quem é dono do projeto (ownerId) pode
 * editá-lo/excluí-lo. Espelha a regra de módulos/tarefas ({@link assertCanModifyModule}).
 */
export function assertCanModifyProject(
  project: Project,
  requesterId: string,
  requesterRole: UserRole,
): void {
  if (requesterRole === UserRole.ADMIN) return;
  if (project.ownerId && project.ownerId === requesterId) return;
  throw new ForbiddenException('Você só pode alterar projetos que você criou.');
}
