import { Inject, Injectable } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/entities/enums';

export interface CreateTaskInput {
  projectId: string;
  moduleId: string;
  epicId: string;
  parentTaskId?: string | null;
  title: string;
  description: string;
  status?: TaskStatus;
  complexity?: number;
  assigneeId: string;
  reporterId: string;
  estimatedHours?: number;
  actualHours?: number;
  order?: number;
  blockedReason?: string | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  isUrgent?: boolean;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    const task = new Task({
      projectId: input.projectId,
      moduleId: input.moduleId,
      epicId: input.epicId,
      parentTaskId: input.parentTaskId ?? null,
      title: input.title,
      description: input.description,
      status: input.status ?? TaskStatus.BACKLOG,
      complexity: input.complexity ?? 1,
      assigneeId: input.assigneeId,
      reporterId: input.reporterId,
      estimatedHours: input.estimatedHours ?? 0,
      actualHours: input.actualHours ?? 0,
      order: input.order ?? 0,
      blockedReason: input.blockedReason ?? null,
      startDate: input.startDate ?? null,
      dueDate: input.dueDate ?? null,
      isUrgent: input.isUrgent ?? false,
    });

    const savedTask = await this.taskRepository.create(task);

    // Se a tarefa foi criada como urgente, bloqueamos as outras
    if (savedTask.isUrgent) {
      const assigneeTasks = await this.taskRepository.findByAssignee(savedTask.assigneeId);
      for (const t of assigneeTasks) {
        if (t.id !== savedTask.id && t.status !== TaskStatus.CONCLUIDA && t.status !== TaskStatus.CANCELADA) {
          t.blockDueToUrgency(savedTask.id);
          await this.taskRepository.update(t);
        }
      }
    }

    return savedTask;
  }
}
