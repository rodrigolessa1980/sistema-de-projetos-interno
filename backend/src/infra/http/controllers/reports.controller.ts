import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { PrismaService } from '../../database/prisma/prisma.service';

interface DeveloperStats {
  userId: string;
  name: string;
  avatar: string | null;
  totalHours: number;
  logCount: number;
  taskCount: number;
  avgHoursPerDay: number;
}

interface CalendarDay {
  date: string;
  totalHours: number;
  developers: {
    userId: string;
    name: string;
    avatar: string | null;
    hours: number;
    logs: { taskId: string; taskTitle: string; hours: number; description: string }[];
  }[];
}

interface ProjectSummary {
  projectId: string;
  projectName: string;
  estimatedHours: number;
  actualHours: number;
  remainingHours: number;
  progressPercent: number;
  deviationPercent: number;
  workingDaysConsumed: number;
  workingDaysEstimated: number;
  startDate: string | null;
  developers: DeveloperStats[];
}

interface ProjectCalendar {
  projectId: string;
  days: CalendarDay[];
}

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('projects/:id/summary')
  @RequirePermission('metrics:read')
  async getProjectSummary(@Param('id') projectId: string): Promise<ProjectSummary> {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        estimatedHours: true,
        actualHours: true,
        progress: true,
        startDate: true,
      },
    });

    const logs = await this.prisma.timeLog.findMany({
      where: { projectId, endedAt: { not: null } },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    // Agrupa horas por desenvolvedor
    const devMap = new Map<string, DeveloperStats>();
    const devDates = new Map<string, Set<string>>();

    for (const log of logs) {
      const uid = log.userId;
      if (!devMap.has(uid)) {
        devMap.set(uid, {
          userId: uid,
          name: log.user.name,
          avatar: log.user.avatar,
          totalHours: 0,
          logCount: 0,
          taskCount: 0,
          avgHoursPerDay: 0,
        });
        devDates.set(uid, new Set());
      }
      const stats = devMap.get(uid)!;
      stats.totalHours = Number((stats.totalHours + Number(log.hours)).toFixed(4));
      stats.logCount += 1;
      devDates.get(uid)!.add(log.date.toISOString().split('T')[0]);
    }

    // Conta tasks únicas por dev
    const tasksByDev = await this.prisma.timeLog.groupBy({
      by: ['userId', 'taskId'],
      where: { projectId, endedAt: { not: null } },
    });
    for (const row of tasksByDev) {
      const stats = devMap.get(row.userId);
      if (stats) stats.taskCount += 1;
    }

    // Calcula média por dia trabalhado
    for (const [uid, stats] of devMap) {
      const days = devDates.get(uid)?.size ?? 1;
      stats.avgHoursPerDay = Number((stats.totalHours / days).toFixed(2));
    }

    const actualHours = Number(project.actualHours);
    const estimatedHours = project.estimatedHours;
    const remainingHours = Math.max(0, estimatedHours - actualHours);
    const deviationPercent = estimatedHours > 0
      ? Number(((actualHours / estimatedHours) * 100).toFixed(1))
      : 0;

    // Dias úteis consumidos: soma horas / 8h (jornada padrão)
    const workingDaysConsumed = Number((actualHours / 8).toFixed(1));
    const workingDaysEstimated = Number((estimatedHours / 8).toFixed(1));

    return {
      projectId: project.id,
      projectName: project.name,
      estimatedHours,
      actualHours,
      remainingHours,
      progressPercent: project.progress,
      deviationPercent,
      workingDaysConsumed,
      workingDaysEstimated,
      startDate: project.startDate ? project.startDate.toISOString().split('T')[0] : null,
      developers: Array.from(devMap.values()).sort((a, b) => b.totalHours - a.totalHours),
    };
  }

  @Get('projects/:id/calendar')
  @RequirePermission('metrics:read')
  async getProjectCalendar(@Param('id') projectId: string): Promise<ProjectCalendar> {
    const logs = await this.prisma.timeLog.findMany({
      where: { projectId, endedAt: { not: null } },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { date: 'asc' },
    });

    // Agrupa por data → desenvolvedor
    const dayMap = new Map<string, Map<string, CalendarDay['developers'][0]>>();

    for (const log of logs) {
      const dateKey = log.date.toISOString().split('T')[0];
      if (!dayMap.has(dateKey)) dayMap.set(dateKey, new Map());

      const devs = dayMap.get(dateKey)!;
      const uid = log.userId;
      if (!devs.has(uid)) {
        devs.set(uid, {
          userId: uid,
          name: log.user.name,
          avatar: log.user.avatar,
          hours: 0,
          logs: [],
        });
      }
      const devEntry = devs.get(uid)!;
      devEntry.hours = Number((devEntry.hours + Number(log.hours)).toFixed(4));
      devEntry.logs.push({
        taskId: log.task.id,
        taskTitle: log.task.title,
        hours: Number(log.hours),
        description: log.description,
      });
    }

    const days: CalendarDay[] = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, devsMap]) => {
        const developers = Array.from(devsMap.values());
        const totalHours = developers.reduce((sum, d) => sum + d.hours, 0);
        return { date, totalHours: Number(totalHours.toFixed(4)), developers };
      });

    return { projectId, days };
  }
}
