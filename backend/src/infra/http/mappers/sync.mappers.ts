/**
 * Mappers de linha crua do Prisma -> forma HTTP, compartilhados pelo bootstrap (INC-01)
 * e pelo delta sync (INC-12). Mantêm UMA definição das formas que o front normaliza,
 * com coerção de `Number()` (Float/Decimal do driver) e datas em ISO.
 */

function toISO(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function dateOnly(value: Date | null | undefined): string | null {
  return value ? value.toISOString().split('T')[0] : null;
}

export function mapProject(p: any) {
  return {
    id: p.id,
    companyId: p.companyId,
    name: p.name,
    description: p.description,
    technicalDescription: p.technicalDescription,
    demandDescription: p.demandDescription,
    requestedBy: p.requestedBy,
    status: p.status,
    ownerId: p.ownerId,
    developerIds: (p.developers ?? []).map((d: any) => d.userId),
    startDate: toISO(p.startDate),
    endDate: toISO(p.endDate),
    estimatedHours: p.estimatedHours,
    actualHours: Number(p.actualHours),
    progress: p.progress,
    color: p.color,
    avatar: p.avatar,
    testUrl: p.testUrl,
    queueOrder: p.queueOrder,
    createdAt: toISO(p.createdAt),
    updatedAt: toISO(p.updatedAt),
  };
}

export function mapModule(m: any) {
  return {
    id: m.id,
    projectId: m.projectId,
    name: m.name,
    description: m.description,
    status: m.status,
    order: m.order,
    progress: m.progress,
    workDate: dateOnly(m.workDate),
    loggedHours: m.loggedHours != null ? Number(m.loggedHours) : null,
    loggedByUserId: m.loggedByUserId ?? null,
    createdById: m.createdById ?? null,
    createdAt: toISO(m.createdAt),
    updatedAt: toISO(m.updatedAt),
  };
}

export function mapEpic(e: any) {
  return {
    id: e.id,
    projectId: e.projectId,
    moduleId: e.moduleId,
    name: e.name,
    description: e.description,
    status: e.status,
    startDate: toISO(e.startDate),
    endDate: toISO(e.endDate),
    progress: e.progress,
    developerIds: (e.developers ?? []).map((d: any) => d.userId),
    createdAt: toISO(e.createdAt),
    updatedAt: toISO(e.updatedAt),
  };
}

export function mapTask(t: any) {
  return {
    id: t.id,
    projectId: t.projectId,
    moduleId: t.moduleId,
    epicId: t.epicId,
    parentTaskId: t.parentTaskId,
    title: t.title,
    description: t.description,
    status: t.status,
    complexity: t.complexity,
    assigneeId: t.assigneeId,
    reporterId: t.reporterId,
    estimatedHours: t.estimatedHours,
    actualHours: Number(t.actualHours),
    startDate: toISO(t.startDate),
    dueDate: toISO(t.dueDate),
    completedAt: toISO(t.completedAt),
    blockedReason: t.blockedReason,
    isUrgent: t.isUrgent,
    urgentBlockedById: t.urgentBlockedById,
    urgentPreviousStatus: t.urgentPreviousStatus,
    order: t.order,
    createdAt: toISO(t.createdAt),
    updatedAt: toISO(t.updatedAt),
  };
}

export function mapTimeLog(t: any) {
  return {
    id: t.id,
    projectId: t.projectId,
    taskId: t.taskId,
    userId: t.userId,
    hours: Number(t.hours),
    durationSeconds: t.durationSeconds ?? null,
    description: t.description,
    date: toISO(t.date),
    startedAt: toISO(t.startedAt),
    endedAt: toISO(t.endedAt),
    source: t.source,
    status: t.status,
    createdAt: toISO(t.createdAt),
    updatedAt: toISO(t.updatedAt),
  };
}

export function mapComment(c: any) {
  return {
    id: c.id,
    taskId: c.taskId,
    userId: c.userId,
    content: c.content,
    mentions: Array.isArray(c.mentions) ? c.mentions : [],
    createdAt: toISO(c.createdAt),
    updatedAt: toISO(c.updatedAt),
  };
}

export function mapSubtask(s: any) {
  return {
    id: s.id,
    taskId: s.taskId,
    title: s.title,
    completed: s.completed,
    assigneeId: s.assigneeId ?? undefined,
    createdAt: toISO(s.createdAt),
    updatedAt: toISO(s.updatedAt),
  };
}

export function mapTaskNote(n: any) {
  return {
    id: n.id,
    taskId: n.taskId,
    userId: n.userId,
    content: n.content,
    isPinned: n.isPinned,
    createdAt: toISO(n.createdAt),
    updatedAt: toISO(n.updatedAt),
  };
}

export function mapTaskDependency(d: any) {
  return {
    id: d.id,
    taskId: d.taskId,
    dependsOnTaskId: d.dependsOnTaskId,
    type: d.type,
    createdAt: toISO(d.createdAt),
    // Dependência é imutável (create/delete): expõe updatedAt=createdAt para
    // caber no merge por versão do delta sync (mergeById espera updatedAt).
    updatedAt: toISO(d.createdAt),
  };
}
