import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITaskDependencyRepository } from '../../../core/domain/repositories/task-dependency-repository.interface';
import { TaskDependency } from '../../../core/domain/entities/task-dependency.entity';
import { DependencyType } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaTaskDependencyRepository implements ITaskDependencyRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): TaskDependency {
    return new TaskDependency({
      id: raw.id,
      taskId: raw.taskId,
      dependsOnTaskId: raw.dependsOnTaskId,
      type: raw.type as DependencyType,
      createdAt: raw.createdAt,
    });
  }

  async create(dependency: TaskDependency): Promise<TaskDependency> {
    const raw = await this.prisma.taskDependency.create({
      data: {
        id: dependency.id || undefined,
        taskId: dependency.taskId,
        dependsOnTaskId: dependency.dependsOnTaskId,
        type: dependency.type,
      },
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.taskDependency.delete({ where: { id } });
  }
}
