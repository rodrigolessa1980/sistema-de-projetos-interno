import { TimeLog } from '../../../core/domain/entities/time-log.entity';
import { TaskStatus, TimeLogSource } from '../../../core/domain/entities/enums';

export interface TimeLogResponse {
  id: string;
  projectId: string;
  taskId: string;
  userId: string;
  hours: number;
  durationSeconds: number | null;
  description: string;
  date: string;
  startedAt: string | null;
  endedAt: string | null;
  source: TimeLogSource;
  status: TaskStatus;
  createdAt: string;
}

export class TimeLogPresenter {
  static toHTTP(timeLog: TimeLog): TimeLogResponse {
    return {
      id: timeLog.id,
      projectId: timeLog.projectId,
      taskId: timeLog.taskId,
      userId: timeLog.userId,
      hours: timeLog.hours,
      durationSeconds: timeLog.durationSeconds,
      description: timeLog.description,
      date: timeLog.date.toISOString(),
      startedAt: timeLog.startedAt ? timeLog.startedAt.toISOString() : null,
      endedAt: timeLog.endedAt ? timeLog.endedAt.toISOString() : null,
      source: timeLog.source,
      status: timeLog.status,
      createdAt: timeLog.createdAt.toISOString(),
    };
  }
}
