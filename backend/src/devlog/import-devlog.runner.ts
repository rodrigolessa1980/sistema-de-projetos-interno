import type { PrismaClient } from '../generated/prisma/client';
import {
  ModuleStatus,
  ProjectStatus,
  TaskStatus,
  TimeLogSource,
  UserRole,
} from '../core/domain/entities/enums';
import type {
  DevlogImportResult,
  DevlogManifest,
  DevlogModuleEntry,
  DevlogProjectEntry,
} from './types';

const VALID_MODULE_STATUSES = new Set<string>(Object.values(ModuleStatus));
const VALID_PROJECT_STATUSES = new Set<string>(Object.values(ProjectStatus));

function progressForStatus(status: ModuleStatus): number {
  return {
    [ModuleStatus.INICIADO]: 0,
    [ModuleStatus.EM_PROCESSO]: 50,
    [ModuleStatus.CONCLUIDO]: 100,
  }[status];
}

function parseDateOnly(value: string): Date {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data inválida: "${value}". Use o formato YYYY-MM-DD.`);
  }
  return date;
}

function normalizeModuleStatus(value: string | undefined): ModuleStatus {
  const status = (value ?? ModuleStatus.INICIADO).toUpperCase();
  if (!VALID_MODULE_STATUSES.has(status)) {
    throw new Error(`Status de módulo inválido: "${value}". Use INICIADO, EM_PROCESSO ou CONCLUIDO.`);
  }
  return status as ModuleStatus;
}

function normalizeProjectStatus(value: string | undefined): ProjectStatus {
  const status = (value ?? ProjectStatus.ATIVO).toUpperCase();
  if (!VALID_PROJECT_STATUSES.has(status)) {
    throw new Error(`Status de projeto inválido: "${value}".`);
  }
  return status as ProjectStatus;
}

export function assertValidManifest(raw: unknown): DevlogManifest {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Manifesto inválido: esperado um objeto JSON.');
  }

  const manifest = raw as DevlogManifest;
  if (!Array.isArray(manifest.projects) || manifest.projects.length === 0) {
    throw new Error('Manifesto inválido: "projects" deve ser um array não vazio.');
  }

  for (const project of manifest.projects) {
    if (!project?.name?.trim()) {
      throw new Error('Cada projeto precisa de "name".');
    }
    for (const moduleEntry of project.modules ?? []) {
      if (!moduleEntry?.name?.trim()) {
        throw new Error(`Projeto "${project.name}": cada módulo precisa de "name".`);
      }
      if (moduleEntry.hours != null && moduleEntry.hours > 0 && !moduleEntry.workDate) {
        throw new Error(
          `Projeto "${project.name}", módulo "${moduleEntry.name}": informe "workDate" quando usar "hours".`,
        );
      }
      normalizeModuleStatus(moduleEntry.status);
    }
    normalizeProjectStatus(project.status);
  }

  return manifest;
}

async function resolveOwnerId(prisma: PrismaClient, ownerEmail?: string): Promise<string> {
  if (ownerEmail) {
    const user = await prisma.user.findFirst({
      where: { email: ownerEmail.trim().toLowerCase(), isActive: true },
      select: { id: true },
    });
    if (!user) {
      throw new Error(`Usuário owner não encontrado: ${ownerEmail}`);
    }
    return user.id;
  }

  const admin = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN, isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  if (!admin) {
    throw new Error('Nenhum administrador ativo encontrado. Informe "ownerEmail" no devlog.json.');
  }
  return admin.id;
}

async function resolveCompanyId(
  prisma: PrismaClient,
  companyName: string | undefined,
): Promise<string | null> {
  if (!companyName?.trim()) return null;
  const company = await prisma.company.findFirst({
    where: { name: companyName.trim() },
    select: { id: true },
  });
  return company?.id ?? null;
}

async function upsertProject(
  prisma: PrismaClient,
  ownerId: string,
  entry: DevlogProjectEntry,
): Promise<{ id: string; created: boolean }> {
  const companyId = await resolveCompanyId(prisma, entry.companyName);
  const status = normalizeProjectStatus(entry.status);
  const startDate = entry.startDate ? parseDateOnly(entry.startDate) : new Date();
  const endDate = entry.endDate ? parseDateOnly(entry.endDate) : null;

  const existing = await prisma.project.findFirst({
    where: { name: entry.name.trim() },
    select: { id: true },
  });

  const data = {
    companyId,
    description: entry.description?.trim() || `Projeto ${entry.name.trim()}`,
    ownerId,
    status,
    startDate,
    endDate,
    estimatedHours: entry.estimatedHours ?? 0,
    color: entry.color ?? '#6366f1',
  };

  if (existing) {
    await prisma.project.update({ where: { id: existing.id }, data });
    return { id: existing.id, created: false };
  }

  const created = await prisma.project.create({
    data: { name: entry.name.trim(), ...data },
    select: { id: true },
  });
  return { id: created.id, created: true };
}

async function createModuleWithTimeLog(
  prisma: PrismaClient,
  projectId: string,
  ownerId: string,
  actorUserId: string,
  entry: DevlogModuleEntry,
  order: number,
): Promise<boolean> {
  const status = normalizeModuleStatus(entry.status);
  const shouldLogTime = entry.hours != null && entry.hours > 0 && entry.workDate;
  const workDate = shouldLogTime ? parseDateOnly(entry.workDate!) : null;
  const hours = shouldLogTime ? entry.hours! : null;
  const description = entry.description?.trim() || `Módulo ${entry.name.trim()}`;

  const runTransaction = () => prisma.$transaction(async (tx) => {
    const moduleRaw = await tx.module.create({
      data: {
        projectId,
        name: entry.name.trim(),
        description,
        status,
        order,
        progress: progressForStatus(status),
        workDate,
        loggedHours: hours,
        loggedByUserId: shouldLogTime ? actorUserId : null,
      },
    });

    if (!shouldLogTime || !workDate || hours == null) return;

    const epicRaw = await tx.epic.create({
      data: {
        projectId,
        moduleId: moduleRaw.id,
        name: entry.name.trim(),
        description,
        status: ProjectStatus.ATIVO,
        startDate: workDate,
        endDate: workDate,
      },
    });
    // EpicDeveloper é tenant-scoped; criado via chamada top-level para a extensão
    // injetar o tenantId (writes aninhados não passam pela extensão).
    await tx.epicDeveloper.create({ data: { epicId: epicRaw.id, userId: ownerId } });

    const taskRaw = await tx.task.create({
      data: {
        projectId,
        moduleId: moduleRaw.id,
        epicId: epicRaw.id,
        title: entry.name.trim(),
        description,
        status: TaskStatus.CONCLUIDA,
        complexity: 1,
        assigneeId: ownerId,
        reporterId: actorUserId,
        estimatedHours: Math.ceil(hours),
        actualHours: hours,
        order: 0,
      },
    });

    await tx.timeLog.create({
      data: {
        projectId,
        taskId: taskRaw.id,
        userId: ownerId,
        hours,
        description,
        date: workDate,
        endedAt: new Date(),
        source: TimeLogSource.MANUAL,
        status: TaskStatus.CONCLUIDA,
      },
    });

    const projectHours = await tx.timeLog.aggregate({
      where: { projectId, endedAt: { not: null } },
      _sum: { hours: true },
    });
    await tx.project.update({
      where: { id: projectId },
      data: { actualHours: projectHours._sum.hours ?? 0 },
    });
  }, { timeout: 120_000, maxWait: 30_000 });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await runTransaction();
      return true;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
  throw lastError;
}

async function syncModule(
  prisma: PrismaClient,
  projectId: string,
  ownerId: string,
  actorUserId: string,
  entry: DevlogModuleEntry,
  order: number,
): Promise<{ created: boolean; timeLogCreated: boolean; skipped: boolean }> {
  const workDate = entry.workDate ? parseDateOnly(entry.workDate) : null;

  const existing = await prisma.module.findFirst({
    where: {
      projectId,
      OR: [
        { name: entry.name.trim() },
        ...(workDate ? [{ workDate }] : []),
      ],
    },
    select: { id: true, status: true, loggedHours: true, name: true },
  });

  if (!existing) {
    const timeLogCreated = await createModuleWithTimeLog(
      prisma,
      projectId,
      ownerId,
      actorUserId,
      entry,
      order,
    );
    return { created: true, timeLogCreated: timeLogCreated && !!entry.hours, skipped: false };
  }

  if (existing.loggedHours != null && Number(existing.loggedHours) > 0 && entry.hours) {
    return { created: false, timeLogCreated: false, skipped: true };
  }

  const status = normalizeModuleStatus(entry.status);
  await prisma.module.update({
    where: { id: existing.id },
    data: {
      name: entry.name.trim(),
      description: entry.description?.trim() || undefined,
      status,
      progress: progressForStatus(status),
      order,
    },
  });
  return { created: false, timeLogCreated: false, skipped: false };
}

const SEED_MODULE_NAMES = ['Entrega Principal', 'Qualidade e Homologacao', 'Qualidade e Homologação'];

async function cleanupProjects(prisma: PrismaClient, names: string[]): Promise<string[]> {
  const removed: string[] = [];
  for (const name of names) {
    const project = await prisma.project.findFirst({ where: { name: name.trim() } });
    if (!project) continue;
    await prisma.project.delete({ where: { id: project.id } });
    removed.push(name);
  }
  return removed;
}

async function removeSeedModules(
  prisma: PrismaClient,
  projectNames: string[],
): Promise<number> {
  if (projectNames.length === 0) return 0;
  const result = await prisma.module.deleteMany({
    where: {
      name: { in: SEED_MODULE_NAMES },
      OR: [{ loggedHours: null }, { loggedHours: 0 }],
      project: { name: { in: projectNames.map((n) => n.trim()) } },
    },
  });
  return result.count;
}

async function recalculateProjectProgress(prisma: PrismaClient, projectId: string): Promise<number> {
  const modules = await prisma.module.findMany({
    where: { projectId },
    select: { progress: true },
  });
  const progress = modules.length
    ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
    : 0;
  await prisma.project.update({ where: { id: projectId }, data: { progress } });
  return progress;
}

export async function runDevlogImport(
  prisma: PrismaClient,
  manifest: DevlogManifest,
  options?: { actorUserId?: string },
): Promise<DevlogImportResult> {
  const ownerId = await resolveOwnerId(prisma, manifest.ownerEmail);
  const actorUserId = options?.actorUserId ?? ownerId;

  const result: DevlogImportResult = {
    ownerId,
    projectsCreated: 0,
    projectsUpdated: 0,
    modulesCreated: 0,
    modulesUpdated: 0,
    modulesSkipped: 0,
    timeLogsCreated: 0,
    projectsRemoved: 0,
    seedModulesRemoved: 0,
    details: [],
  };

  if (manifest.cleanupProjects?.length) {
    const removed = await cleanupProjects(prisma, manifest.cleanupProjects);
    result.projectsRemoved = removed.length;
    for (const name of removed) {
      result.details.push(`Projeto removido (cleanup): ${name}`);
    }
  }

  const projectNames = manifest.removeSeedModulesForProjects?.length
    ? manifest.removeSeedModulesForProjects
    : manifest.projects.map((p) => p.name.trim());
  if (manifest.removeSeedModules) {
    const removedCount = await removeSeedModules(prisma, projectNames);
    result.seedModulesRemoved = removedCount;
    if (removedCount > 0) {
      result.details.push(`Módulos seed removidos: ${removedCount}`);
    }
  }

  for (const projectEntry of manifest.projects) {
    const { id: projectId, created } = await upsertProject(prisma, ownerId, projectEntry);
    if (created) {
      result.projectsCreated += 1;
      result.details.push(`Projeto criado: ${projectEntry.name}`);
    } else {
      result.projectsUpdated += 1;
      result.details.push(`Projeto atualizado: ${projectEntry.name}`);
    }

    const modules = projectEntry.modules ?? [];
    for (let index = 0; index < modules.length; index += 1) {
      const moduleEntry = modules[index];
      const order = moduleEntry.order ?? index;
      const moduleResult = await syncModule(
        prisma,
        projectId,
        ownerId,
        actorUserId,
        moduleEntry,
        order,
      );
      if (moduleResult.created) {
        result.modulesCreated += 1;
        result.details.push(`  + módulo: ${moduleEntry.name}`);
      } else if (moduleResult.skipped) {
        result.modulesSkipped += 1;
        result.details.push(`  = módulo (já registrado): ${moduleEntry.name}`);
      } else {
        result.modulesUpdated += 1;
        result.details.push(`  ~ módulo: ${moduleEntry.name}`);
      }
      if (moduleResult.timeLogCreated) {
        result.timeLogsCreated += 1;
      }
    }

    const progress = await recalculateProjectProgress(prisma, projectId);
    result.details.push(`  progresso do projeto: ${progress}%`);
  }

  return result;
}
