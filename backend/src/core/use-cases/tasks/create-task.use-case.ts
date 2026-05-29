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
  complexity?: number;
  assigneeId: string;
  reporterId: string;
  estimatedHours?: number;
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
      complexity: input.complexity ?? 1,
      assigneeId: input.assigneeId,
      reporterId: input.reporterId,
      estimatedHours: input.estimatedHours ?? 0,
      startDate: input.startDate ?? null,
      dueDate: input.dueDate ?? null,
      isUrgent: input.isUrgent ?? false,
      status: TaskStatus.BACKLOG,
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
