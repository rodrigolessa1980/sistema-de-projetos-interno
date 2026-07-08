import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateModuleCompleteInput,
  CreateModuleCompleteResult,
  IModuleRepository,
} from '../../../core/domain/repositories/module-repository.interface';
import { Module } from '../../../core/domain/entities/module.entity';
import { ModuleAttachment } from '../../../core/domain/entities/module-attachment.entity';
import { Epic } from '../../../core/domain/entities/epic.entity';
import { Task } from '../../../core/domain/entities/task.entity';
import { TimeLog } from '../../../core/domain/entities/time-log.entity';
import { ModuleStatus, ProjectStatus, TaskStatus, TimeLogSource } from '../../../core/domain/entities/enums';

function progressForStatus(status: ModuleStatus): number {
  const progressByStatus: Record<ModuleStatus, number> = {
    [ModuleStatus.INICIADO]: 0,
    [ModuleStatus.EM_PROCESSO]: 50,
    [ModuleStatus.CONCLUIDO]: 100,
  };
  return progressByStatus[status];
}

@Injectable()
export class PrismaModuleRepository implements IModuleRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): Module {
    return new Module({
      id: raw.id,
      projectId: raw.projectId,
      name: raw.name,
      description: raw.description,
      status: raw.status as ModuleStatus,
      order: raw.order,
      progress: raw.progress,
      workDate: raw.workDate ?? null,
      loggedHours: raw.loggedHours != null ? Number(raw.loggedHours) : null,
      loggedByUserId: raw.loggedByUserId ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private mapEpic(raw: any): Epic {
    return new Epic({
      id: raw.id,
      projectId: raw.projectId,
      moduleId: raw.moduleId,
      name: raw.name,
      description: raw.description,
      status: raw.status as ProjectStatus,
      startDate: raw.startDate,
      endDate: raw.endDate ?? null,
      progress: raw.progress,
      developerIds: raw.developers?.map((d: any) => d.userId) ?? [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private mapTask(raw: any): Task {
    return new Task({
      id: raw.id,
      projectId: raw.projectId,
      moduleId: raw.moduleId,
      epicId: raw.epicId,
      parentTaskId: raw.parentTaskId,
      title: raw.title,
      description: raw.description,
      status: raw.status as TaskStatus,
      complexity: raw.complexity,
      assigneeId: raw.assigneeId,
      reporterId: raw.reporterId,
      estimatedHours: raw.estimatedHours,
      actualHours: Number(raw.actualHours),
      startDate: raw.startDate,
      dueDate: raw.dueDate,
      completedAt: raw.completedAt,
      blockedReason: raw.blockedReason,
      isUrgent: raw.isUrgent,
      urgentBlockedById: raw.urgentBlockedById,
      urgentPreviousStatus: raw.urgentPreviousStatus as TaskStatus | null,
      order: raw.order,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private mapTimeLog(raw: any): TimeLog {
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

  private mapAttachment(raw: any): ModuleAttachment {
    return new ModuleAttachment({
      id: raw.id,
      moduleId: raw.moduleId,
      userId: raw.userId,
      name: raw.name,
      type: raw.type,
      size: raw.size,
      dataUrl: raw.dataUrl,
      createdAt: raw.createdAt,
    });
  }

  async create(module: Module): Promise<Module> {
    const raw = await this.prisma.module.create({
      data: {
        id: module.id || undefined,
        projectId: module.projectId,
        name: module.name,
        description: module.description,
        status: module.status,
        order: module.order,
        progress: module.progress,
        workDate: module.workDate,
        loggedHours: module.loggedHours,
        loggedByUserId: module.loggedByUserId,
      },
    });
    return this.mapToDomain(raw);
  }

  async createComplete(input: CreateModuleCompleteInput): Promise<CreateModuleCompleteResult> {
    const shouldLogTime = input.hours != null && input.hours > 0 && input.workDate != null;

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: input.projectId },
        select: { ownerId: true },
      });
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      const existingCount = await tx.module.count({ where: { projectId: input.projectId } });
      const order = input.order ?? existingCount;
      const timeLogUserId = input.assignedUserId ?? project.ownerId;
      const moduleStatus = input.status ?? ModuleStatus.INICIADO;

      const moduleRaw = await tx.module.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          description: input.description,
          status: moduleStatus,
          order,
          progress: progressForStatus(moduleStatus),
          workDate: shouldLogTime ? input.workDate : null,
          loggedHours: shouldLogTime ? input.hours : null,
          loggedByUserId: shouldLogTime ? timeLogUserId : null,
        },
      });

      let epicRaw: any;
      let taskRaw: any;
      let timeLogRaw: any;

      if (shouldLogTime) {
        const workDate = input.workDate!;
        const hours = input.hours!;
        const description = input.description || `Trabalho no módulo: ${input.name}`;

        epicRaw = await tx.epic.create({
          data: {
            projectId: input.projectId,
            moduleId: moduleRaw.id,
            name: input.name,
            description: input.description,
            status: ProjectStatus.ATIVO,
            startDate: workDate,
            endDate: workDate,
          },
        });
        // EpicDeveloper é tenant-scoped; criado via chamada top-level para a
        // extensão injetar o tenantId (writes aninhados não passam pela extensão
        // e cairiam no @default(uuid()) do schema -> FK inválida).
        epicRaw.developers = [
          await tx.epicDeveloper.create({ data: { epicId: epicRaw.id, userId: timeLogUserId } }),
        ];

        taskRaw = await tx.task.create({
          data: {
            projectId: input.projectId,
            moduleId: moduleRaw.id,
            epicId: epicRaw.id,
            title: input.name,
            description,
            status: TaskStatus.CONCLUIDA,
            complexity: 1,
            assigneeId: timeLogUserId,
            reporterId: input.userId,
            estimatedHours: Math.ceil(hours),
            actualHours: 0,
            order: 0,
          },
        });

        timeLogRaw = await tx.timeLog.create({
          data: {
            projectId: input.projectId,
            taskId: taskRaw.id,
            userId: timeLogUserId,
            hours,
            description,
            date: workDate,
            endedAt: new Date(),
            source: TimeLogSource.MANUAL,
            status: TaskStatus.CONCLUIDA,
          },
        });

        await tx.task.update({
          where: { id: taskRaw.id },
          data: { actualHours: hours },
        });

        const projectHours = await tx.timeLog.aggregate({
          where: { projectId: input.projectId, endedAt: { not: null } },
          _sum: { hours: true },
        });
        await tx.project.update({
          where: { id: input.projectId },
          data: { actualHours: projectHours._sum.hours ?? 0 },
        });
      }

      const attachmentRaws = [];
      for (const att of input.attachments ?? []) {
        const raw = await tx.moduleAttachment.create({
          data: {
            moduleId: moduleRaw.id,
            userId: input.userId,
            name: att.name,
            type: att.type,
            size: att.size,
            dataUrl: att.dataUrl,
          },
        });
        attachmentRaws.push(raw);
      }

      return {
        module: this.mapToDomain(moduleRaw),
        epic: epicRaw ? this.mapEpic(epicRaw) : undefined,
        task: taskRaw ? this.mapTask(taskRaw) : undefined,
        timeLog: timeLogRaw ? this.mapTimeLog(timeLogRaw) : undefined,
        attachments: attachmentRaws.map((raw) => this.mapAttachment(raw)),
      };
    }, { timeout: 60_000 });
  }

  async findById(id: string): Promise<Module | null> {
    const raw = await this.prisma.module.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async listByProject(projectId: string): Promise<Module[]> {
    const raws = await this.prisma.module.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
    return raws.map((r) => this.mapToDomain(r));
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: ModuleStatus;
      workDate?: Date | null;
      hours?: number | null;
      assignedUserId?: string;
    },
  ): Promise<Module> {
    const touchesTimeLog =
      data.workDate !== undefined || data.hours !== undefined || data.assignedUserId !== undefined;
    if (!touchesTimeLog) {
      const raw = await this.prisma.module.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
          ...(data.status ? { progress: progressForStatus(data.status) } : {}),
          updatedAt: new Date(),
        },
      });
      return this.mapToDomain(raw);
    }

    return this.prisma.$transaction(async (tx) => {
      const raw = await tx.module.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
          ...(data.status ? { progress: progressForStatus(data.status) } : {}),
          ...(data.workDate !== undefined ? { workDate: data.workDate } : {}),
          ...(data.hours !== undefined ? { loggedHours: data.hours } : {}),
          ...(data.assignedUserId ? { loggedByUserId: data.assignedUserId } : {}),
          updatedAt: new Date(),
        },
      });

      // Sincroniza o(s) time log(s)/task(s) vinculados ao módulo (1 por módulo no fluxo padrão).
      const moduleTasks = await tx.task.findMany({
        where: { moduleId: id },
        select: { id: true },
      });
      const taskIds = moduleTasks.map((t) => t.id);
      if (taskIds.length > 0) {
        const timeLogData: { date?: Date; hours?: number; userId?: string } = {};
        if (data.workDate != null) timeLogData.date = data.workDate;
        if (data.hours != null) timeLogData.hours = data.hours;
        if (data.assignedUserId) timeLogData.userId = data.assignedUserId;
        if (Object.keys(timeLogData).length > 0) {
          await tx.timeLog.updateMany({ where: { taskId: { in: taskIds } }, data: timeLogData });
        }
        if (data.hours != null) {
          await tx.task.updateMany({ where: { id: { in: taskIds } }, data: { actualHours: data.hours } });
        }
        if (data.assignedUserId) {
          await tx.task.updateMany({ where: { id: { in: taskIds } }, data: { assigneeId: data.assignedUserId } });
        }
        // Mantém as datas do épico coerentes com a nova data de trabalho.
        if (data.workDate != null) {
          await tx.epic.updateMany({
            where: { moduleId: id },
            data: { startDate: data.workDate, endDate: data.workDate },
          });
        }
        // Reatribui o desenvolvedor do(s) épico(s) do módulo.
        if (data.assignedUserId) {
          const epics = await tx.epic.findMany({ where: { moduleId: id }, select: { id: true } });
          for (const e of epics) {
            await tx.epicDeveloper.deleteMany({ where: { epicId: e.id } });
            await tx.epicDeveloper
              .create({ data: { epicId: e.id, userId: data.assignedUserId } })
              .catch(() => undefined);
          }
        }

        // Auto-cura: garante 1 time log por módulo (colapsa duplicatas, se houver).
        const allLogs = await tx.timeLog.findMany({
          where: { taskId: { in: taskIds } },
          orderBy: { createdAt: 'asc' },
          select: { id: true },
        });
        if (allLogs.length > 1) {
          await tx.timeLog.deleteMany({ where: { id: { in: allLogs.slice(1).map((l) => l.id) } } });
        }
      }

      const projectHours = await tx.timeLog.aggregate({
        where: { projectId: raw.projectId, endedAt: { not: null } },
        _sum: { hours: true },
      });
      await tx.project.update({
        where: { id: raw.projectId },
        data: { actualHours: projectHours._sum.hours ?? 0 },
      });

      return this.mapToDomain(raw);
    }, { timeout: 60_000, maxWait: 30_000 });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.module.delete({ where: { id } });
  }
}
