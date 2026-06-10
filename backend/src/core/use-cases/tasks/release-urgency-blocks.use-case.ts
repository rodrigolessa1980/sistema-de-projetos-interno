import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/entities/enums';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';

@Injectable()
export class ReleaseUrgencyBlocksUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(urgentTaskId: string): Promise<void> {
    const blockedTasks = await this.taskRepository.findByUrgentBlockedById(urgentTaskId);
    for (const task of blockedTasks) {
      task.releaseUrgencyBlock();
      await this.taskRepository.update(task);
    }
  }

  async repairIfBlockerCompleted(task: Task): Promise<Task> {
    if (!task.urgentBlockedById) {
      return task;
    }

    const blocker = await this.taskRepository.findById(task.urgentBlockedById);
    if (
      !blocker ||
      (blocker.status !== TaskStatus.CONCLUIDA && blocker.status !== TaskStatus.CANCELADA)
    ) {
      return task;
    }

    task.releaseUrgencyBlock();
    return this.taskRepository.update(task);
  }

  async repairStaleBlocksInProject(tasks: Task[]): Promise<Task[]> {
    const tasksById = new Map(tasks.map((task) => [task.id, task]));
    const repaired: Task[] = [];

    for (const task of tasks) {
      if (!task.urgentBlockedById) {
        repaired.push(task);
        continue;
      }

      const blocker =
        tasksById.get(task.urgentBlockedById) ??
        (await this.taskRepository.findById(task.urgentBlockedById));

      if (
        !blocker ||
        (blocker.status !== TaskStatus.CONCLUIDA && blocker.status !== TaskStatus.CANCELADA)
      ) {
        repaired.push(task);
        continue;
      }

      task.releaseUrgencyBlock();
      repaired.push(await this.taskRepository.update(task));
    }

    return repaired;
  }
}
