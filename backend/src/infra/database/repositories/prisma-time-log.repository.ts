import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITimeLogRepository } from '../../../core/domain/repositories/time-log-repository.interface';
import { TimeLog } from '../../../core/domain/entities/time-log.entity';
import { TaskStatus, TimeLogSource } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaTimeLogRepository implements ITimeLogRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): TimeLog {
    return new TimeLog({
      id: raw.id,
      projectId: raw.projectId,
      taskId: raw.taskId,
      userId: raw.userId,
      hours: Number(raw.hours),
      durationSeconds: raw.durationSeconds,
      description: raw.description,
      date: raw.date,
      startedAt: raw.startedAt,
      endedAt: raw.endedAt,
      source: raw.source as TimeLogSource,
      status: raw.status as TaskStatus,
      createdAt: raw.createdAt,
    });
  }

  async findById(id: string): Promise<TimeLog | null> {
    const raw = await this.prisma.timeLog.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async create(timeLog: TimeLog): Promise<TimeLog> {
    const raw = await this.prisma.timeLog.create({
      data: {
        id: timeLog.id || undefined,
        projectId: timeLog.projectId,
        taskId: timeLog.taskId,
        userId: timeLog.userId,
        hours: timeLog.hours,
        durationSeconds: timeLog.durationSeconds,
        description: timeLog.description,
        date: timeLog.date,
        startedAt: timeLog.startedAt,
        endedAt: timeLog.endedAt,
        source: timeLog.source,
        status: timeLog.status,
      },
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.timeLog.delete({ where: { id } });
  }

  async findByTaskId(taskId: string): Promise<TimeLog[]> {
    const raws = await this.prisma.timeLog.findMany({ where: { taskId } });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findByUserId(userId: string): Promise<TimeLog[]> {
    const raws = await this.prisma.timeLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findByProjectId(projectId: string): Promise<TimeLog[]> {
    const raws = await this.prisma.timeLog.findMany({
      where: { projectId },
      orderBy: { date: 'desc' },
    });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findActiveSessionByUserId(userId: string): Promise<TimeLog | null> {
    const raw = await this.prisma.timeLog.findFirst({
      where: { userId, endedAt: null },
    });
    return raw ? this.mapToDomain(raw) : null;
  }

  async sumFinalizedHoursByTaskId(taskId: string): Promise<number> {
    const result = await this.prisma.timeLog.aggregate({
      where: { taskId, endedAt: { not: null } },
      _sum: { hours: true },
    });
    return result._sum.hours ?? 0;
  }

  async sumFinalizedHoursByProjectId(projectId: string): Promise<number> {
    const result = await this.prisma.timeLog.aggregate({
      where: { projectId, endedAt: { not: null } },
      _sum: { hours: true },
    });
    return result._sum.hours ?? 0;
  }
}
