import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITimeLogRepository } from '../../../core/domain/repositories/time-log-repository.interface';
import { TimeLog } from '../../../core/domain/entities/time-log.entity';
import { TaskStatus } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaTimeLogRepository implements ITimeLogRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): TimeLog {
    return new TimeLog({
      id: raw.id,
      taskId: raw.taskId,
      userId: raw.userId,
      hours: Number(raw.hours),
      description: raw.description,
      date: raw.date,
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
        taskId: timeLog.taskId,
        userId: timeLog.userId,
        hours: timeLog.hours,
        description: timeLog.description,
        date: timeLog.date,
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
    const raws = await this.prisma.timeLog.findMany({ where: { userId } });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findActiveSessionByUserId(userId: string): Promise<TimeLog | null> {
    // Retorna null por padrão na inicialização do tracker
    return null;
  }
}
