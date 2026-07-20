import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { NotificationType } from '../domain/entities/enums';

export interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedTaskId?: string | null;
  relatedProjectId?: string | null;
}

/**
 * Cria notificações direcionadas a um usuário (ex.: "você foi atribuído a X",
 * "a tarefa Y foi concluída"). Usa o client ESTENDIDO (tenantId é injetado
 * automaticamente), então roda dentro do contexto de tenant da requisição.
 *
 * Best-effort: uma falha ao notificar é logada mas NUNCA derruba a operação de
 * negócio que a disparou (salvar tarefa, concluir, etc.).
 */
@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async notify(input: NotifyInput): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          relatedTaskId: input.relatedTaskId ?? null,
          relatedProjectId: input.relatedProjectId ?? null,
        },
      });
    } catch (error) {
      console.error('[NotificationService] falha ao criar notificação:', error);
    }
  }
}
