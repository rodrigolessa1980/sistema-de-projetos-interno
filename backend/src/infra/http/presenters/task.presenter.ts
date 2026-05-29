import { Task } from '../../../core/domain/entities/task.entity';
import { TaskStatus } from '../../../core/domain/entities/enums';

export interface TaskResponse {
  id: string;
  projectId: string;
  moduleId: string;
  epicId: string;
  parentTaskId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  complexity: number;
  assigneeId: string;
  reporterId: string;
  estimatedHours: number;
  actualHours: number;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  blockedReason: string | null;
  isUrgent: boolean;
  urgentBlockedById: string | null;
  urgentPreviousStatus: TaskStatus | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export class TaskPresenter {
  static toHTTP(task: Task): TaskResponse {
    return {
      id: task.id,
      projectId: task.projectId,
      moduleId: task.moduleId,
      epicId: task.epicId,
      parentTaskId: task.parentTaskId,
      title: task.title,
      description: task.description,
      status: task.status,
      complexity: task.complexity,
      assigneeId: task.assigneeId,
      reporterId: task.reporterId,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      startDate: task.startDate ? task.startDate.toISOString() : null,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      completedAt: task.completedAt ? task.completedAt.toISOString() : null,
      blockedReason: task.blockedReason,
      isUrgent: task.isUrgent,
      urgentBlockedById: task.urgentBlockedById,
      urgentPreviousStatus: task.urgentPreviousStatus,
      order: task.order,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
