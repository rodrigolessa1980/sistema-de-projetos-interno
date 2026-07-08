import 'dotenv/config';
import {
  AuditEntityType,
  NotificationType,
  PrismaClient,
  ProjectStatus,
  TaskStatus,
  TimeLogSource,
  UserRole,
} from '../src/generated/prisma/client';
import { createPrismaMariaDbAdapter } from '../src/infra/config/mysql.config';
import { tenantExtension } from '../src/infra/tenancy/tenant.extension';
import { TenantContext } from '../src/infra/tenancy/tenant-context';
import { TENANT_IDS, TENANT_SLUGS } from '../src/infra/tenancy/tenant.constants';

// Client base para operações fora de tenant (upsert dos tenants) e conexão.
const base = new PrismaClient({
  adapter: createPrismaMariaDbAdapter(),
});
// Client estendido: usado por todo o seed dentro do contexto Desenvolvimento.
const prisma = base.$extends(tenantExtension);

/** Garante os dois tenants (idempotente com os UUIDs fixos da migration). */
async function ensureTenants() {
  await base.tenant.upsert({
    where: { id: TENANT_IDS.DESENVOLVIMENTO },
    update: {},
    create: {
      id: TENANT_IDS.DESENVOLVIMENTO,
      name: 'Desenvolvimento',
      slug: TENANT_SLUGS.DESENVOLVIMENTO,
    },
  });
  await base.tenant.upsert({
    where: { id: TENANT_IDS.MARKETING },
    update: {},
    create: {
      id: TENANT_IDS.MARKETING,
      name: 'Marketing',
      slug: TENANT_SLUGS.MARKETING,
    },
  });
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

async function ensureCompany(data: {
  name: string;
  shortName: string;
  color: string;
  cnpj: string | null;
}) {
  const existing = await prisma.company.findFirst({
    where: { shortName: data.shortName },
  });

  if (existing) {
    return prisma.company.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.company.create({ data });
}

async function ensureProject(data: {
  name: string;
  description: string;
  companyId: string | null;
  ownerId: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  color: string;
  queueOrder: number;
  developerIds: string[];
}) {
  const existing = await prisma.project.findFirst({ where: { name: data.name } });
  const projectData = {
    companyId: data.companyId,
    description: data.description,
    ownerId: data.ownerId,
    status: data.status,
    startDate: data.startDate,
    endDate: data.endDate,
    estimatedHours: data.estimatedHours,
    actualHours: data.actualHours,
    progress: data.progress,
    color: data.color,
    queueOrder: data.queueOrder,
  };

  const project = existing
    ? await prisma.project.update({ where: { id: existing.id }, data: projectData })
    : await prisma.project.create({ data: { name: data.name, ...projectData } });

  for (const userId of data.developerIds) {
    await prisma.projectDeveloper.upsert({
      where: { projectId_userId: { projectId: project.id, userId } },
      update: {},
      create: { projectId: project.id, userId },
    });
  }

  return project;
}

async function ensureModule(projectId: string, name: string, order: number) {
  const existing = await prisma.module.findFirst({ where: { projectId, name } });
  const data = {
    description: `Modulo ${name.toLowerCase()} para organizar entregas do projeto.`,
    order,
    progress: order === 0 ? 35 : 15,
  };

  if (existing) {
    return prisma.module.update({ where: { id: existing.id }, data });
  }

  return prisma.module.create({
    data: {
      projectId,
      name,
      ...data,
    },
  });
}

async function ensureEpic(projectId: string, moduleId: string, name: string, developerIds: string[]) {
  const existing = await prisma.epic.findFirst({ where: { projectId, moduleId, name } });
  const data = {
    description: `Escopo de trabalho para ${name.toLowerCase()}, com tarefas planejadas e acompanhamento por status.`,
    status: ProjectStatus.ATIVO,
    startDate: daysFromNow(-5),
    endDate: daysFromNow(25),
    progress: 30,
  };

  const epic = existing
    ? await prisma.epic.update({ where: { id: existing.id }, data })
    : await prisma.epic.create({
        data: {
          projectId,
          moduleId,
          name,
          ...data,
        },
      });

  for (const userId of developerIds) {
    await prisma.epicDeveloper.upsert({
      where: { epicId_userId: { epicId: epic.id, userId } },
      update: {},
      create: { epicId: epic.id, userId },
    });
  }

  return epic;
}

async function ensureTask(data: {
  projectId: string;
  moduleId: string;
  epicId: string;
  title: string;
  description: string;
  status: TaskStatus;
  complexity: number;
  assigneeId: string;
  reporterId: string;
  estimatedHours: number;
  actualHours: number;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt?: Date | null;
  blockedReason?: string | null;
  isUrgent?: boolean;
  order: number;
}) {
  const existing = await prisma.task.findFirst({
    where: { projectId: data.projectId, title: data.title },
  });

  const taskData = {
    moduleId: data.moduleId,
    epicId: data.epicId,
    description: data.description,
    status: data.status,
    complexity: data.complexity,
    assigneeId: data.assigneeId,
    reporterId: data.reporterId,
    estimatedHours: data.estimatedHours,
    actualHours: data.actualHours,
    startDate: data.startDate,
    dueDate: data.dueDate,
    completedAt: data.completedAt ?? null,
    blockedReason: data.blockedReason ?? null,
    isUrgent: data.isUrgent ?? false,
    order: data.order,
  };

  if (existing) {
    return prisma.task.update({ where: { id: existing.id }, data: taskData });
  }

  return prisma.task.create({
    data: {
      projectId: data.projectId,
      title: data.title,
      ...taskData,
    },
  });
}

async function ensureTimeLog(data: {
  projectId: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string;
  date: Date;
  status: TaskStatus;
}) {
  const existing = await prisma.timeLog.findFirst({
    where: {
      taskId: data.taskId,
      userId: data.userId,
      date: data.date,
      description: data.description,
    },
  });

  if (existing) return existing;

  return prisma.timeLog.create({
    data: {
      ...data,
      source: TimeLogSource.MANUAL,
    },
  });
}

async function ensureNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedTaskId?: string;
  relatedProjectId?: string;
}) {
  const existing = await prisma.notification.findFirst({
    where: {
      userId: data.userId,
      title: data.title,
      relatedTaskId: data.relatedTaskId,
      relatedProjectId: data.relatedProjectId,
    },
  });

  if (existing) return existing;

  return prisma.notification.create({
    data: {
      ...data,
      read: false,
    },
  });
}

async function cleanupPhantomUsers(emails: string[], fallbackOwnerId?: string) {
  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true },
  });
  const userIds = users.map((user) => user.id);

  if (userIds.length === 0) return;

  const tasks = await prisma.task.findMany({
    where: {
      OR: [{ assigneeId: { in: userIds } }, { reporterId: { in: userIds } }],
    },
    select: { id: true },
  });
  const taskIds = tasks.map((task) => task.id);

  if (taskIds.length > 0) {
    await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { entityType: AuditEntityType.TASK, entityId: { in: taskIds } },
          { userId: { in: userIds } },
        ],
      },
    });
    await prisma.notification.deleteMany({
      where: {
        OR: [{ userId: { in: userIds } }, { relatedTaskId: { in: taskIds } }],
      },
    });
    await prisma.taskDependency.deleteMany({
      where: {
        OR: [{ taskId: { in: taskIds } }, { dependsOnTaskId: { in: taskIds } }],
      },
    });
    await prisma.task.deleteMany({ where: { id: { in: taskIds } } });
  }

  await prisma.auditLog.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        { entityType: AuditEntityType.USER, entityId: { in: userIds } },
      ],
    },
  });
  await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.timeLog.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.comment.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.taskNote.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.taskAttachment.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.statusHistory.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.epicDeveloper.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.projectDeveloper.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.userPermission.deleteMany({ where: { userId: { in: userIds } } });
  if (fallbackOwnerId) {
    await prisma.project.updateMany({
      where: { ownerId: { in: userIds } },
      data: { ownerId: fallbackOwnerId },
    });
  }
  await prisma.subtask.updateMany({
    where: { assigneeId: { in: userIds } },
    data: { assigneeId: null },
  });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

async function main() {
  const phantomDeveloperEmails = ['ana@devflow.com', 'lucas@devflow.com', 'fernanda@devflow.com'];
  const phantomAdminEmails = ['admin@devflow.com'];

  const fallbackAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.ADMIN,
      isActive: true,
      email: { notIn: phantomAdminEmails },
    },
    orderBy: { createdAt: 'asc' },
  });

  await cleanupPhantomUsers(phantomDeveloperEmails);
  await cleanupPhantomUsers(phantomAdminEmails, fallbackAdmin?.id);

  const admin = fallbackAdmin ?? await prisma.user.findFirst({
    where: { role: UserRole.ADMIN, isActive: true },
    orderBy: { createdAt: 'asc' },
  });

  if (!admin) {
    console.log('Seed concluido sem dados: nenhum administrador real ativo encontrado.');
    return;
  }

  const developers = await prisma.user.findMany({
    where: {
      role: UserRole.DEVELOPER,
      isActive: true,
      email: { notIn: phantomDeveloperEmails },
    },
    orderBy: { createdAt: 'asc' },
  });

  const companies = await Promise.all([
    ensureCompany({ name: 'Monkey Tech', shortName: 'MKT', color: '#8B5CF6', cnpj: null }),
    ensureCompany({ name: 'Cliente Alpha', shortName: 'ALP', color: '#3B82F6', cnpj: null }),
    ensureCompany({ name: 'Cliente Beta', shortName: 'BET', color: '#10B981', cnpj: null }),
  ]);

  const existingProjects = await prisma.project.findMany({
    orderBy: [{ queueOrder: 'asc' }, { createdAt: 'asc' }],
  });

  let projects = existingProjects;
  if (projects.length === 0) {
    projects = await Promise.all([
      ensureProject({
        name: 'Plataforma E-commerce',
        description: 'Evolucao da plataforma comercial com checkout, carrinho e painel operacional.',
        companyId: companies[1].id,
        ownerId: admin.id,
        status: ProjectStatus.ATIVO,
        startDate: daysFromNow(-20),
        endDate: daysFromNow(45),
        estimatedHours: 240,
        actualHours: 68,
        progress: 34,
        color: '#3B82F6',
        queueOrder: 1,
        developerIds: developers.map((dev) => dev.id),
      }),
      ensureProject({
        name: 'Sistema Interno de Tecnologia',
        description: 'Ferramenta interna para controle de projetos, tarefas, horas e produtividade.',
        companyId: companies[0].id,
        ownerId: admin.id,
        status: ProjectStatus.ATIVO,
        startDate: daysFromNow(-12),
        endDate: daysFromNow(30),
        estimatedHours: 180,
        actualHours: 52,
        progress: 28,
        color: '#8B5CF6',
        queueOrder: 2,
        developerIds: developers.map((dev) => dev.id),
      }),
    ]);
  }

  const queuedProjects = projects
    .filter((project) => project.status !== ProjectStatus.CONCLUIDO && project.status !== ProjectStatus.CANCELADO)
    .slice(0, 6);

  for (let index = 0; index < queuedProjects.length; index += 1) {
    await prisma.project.update({
      where: { id: queuedProjects[index].id },
      data: { queueOrder: index + 1 },
    });
  }

  const projectsToPopulate = await prisma.project.findMany({
    where: { id: { in: queuedProjects.map((project) => project.id) } },
    orderBy: { queueOrder: 'asc' },
  });

  const taskTitlesByStatus = [
    {
      status: TaskStatus.BACKLOG,
      title: 'Mapear regras de negocio pendentes',
      dueOffset: 18,
      actualHours: 0,
    },
    {
      status: TaskStatus.PLANEJADA,
      title: 'Preparar contrato visual da tela principal',
      dueOffset: 12,
      actualHours: 1.5,
    },
    {
      status: TaskStatus.BLOQUEADA,
      title: 'Resolver dependencia de integracao externa',
      dueOffset: 3,
      actualHours: 2,
      blockedReason: 'Aguardando credenciais e resposta da integracao externa.',
    },
    {
      status: TaskStatus.EM_DESENVOLVIMENTO,
      title: 'Implementar fluxo principal da entrega',
      dueOffset: 7,
      actualHours: 5,
    },
    {
      status: TaskStatus.EM_REVISAO,
      title: 'Revisar validacoes e mensagens de erro',
      dueOffset: 5,
      actualHours: 3,
    },
    {
      status: TaskStatus.HOMOLOGACAO,
      title: 'Validar pacote com usuario chave',
      dueOffset: 10,
      actualHours: 4,
    },
    {
      status: TaskStatus.CONCLUIDA,
      title: 'Concluir estrutura inicial do modulo',
      dueOffset: -4,
      actualHours: 6,
      completedAt: daysFromNow(-2),
    },
    {
      status: TaskStatus.CANCELADA,
      title: 'Cancelar alternativa substituida pelo novo escopo',
      dueOffset: -1,
      actualHours: 1,
    },
  ];

  if (developers.length === 0) {
    console.log('Seed concluido sem tarefas: nenhum desenvolvedor real ativo encontrado.');
    return;
  }

  for (const [projectIndex, project] of projectsToPopulate.entries()) {
    const assignedDeveloperIds = developers.map((dev) => dev.id);
    for (const userId of assignedDeveloperIds) {
      await prisma.projectDeveloper.upsert({
        where: { projectId_userId: { projectId: project.id, userId } },
        update: {},
        create: { projectId: project.id, userId },
      });
    }

    const module = await ensureModule(project.id, projectIndex === 0 ? 'Carrinho' : 'Entrega Principal', 0);
    const supportModule = await ensureModule(project.id, 'Qualidade e Homologacao', 1);
    const epic = await ensureEpic(project.id, module.id, 'Entrega Operacional', assignedDeveloperIds);
    await ensureEpic(project.id, supportModule.id, 'Validacao e Ajustes', assignedDeveloperIds.slice(0, 2));

    const createdTasks = [];
    for (let index = 0; index < taskTitlesByStatus.length; index += 1) {
      const seed = taskTitlesByStatus[index];
      const assignee = developers[index % developers.length];
      createdTasks.push(
        await ensureTask({
          projectId: project.id,
          moduleId: module.id,
          epicId: epic.id,
          title: `${seed.title} - ${project.name}`,
          description: `Tarefa de exemplo para validar exibicao, filtros, Kanban, metricas e relatorios do projeto ${project.name}.`,
          status: seed.status,
          complexity: [1, 2, 3, 5, 8][index % 5],
          assigneeId: assignee.id,
          reporterId: admin.id,
          estimatedHours: 4 + index,
          actualHours: seed.actualHours,
          startDate: seed.status === TaskStatus.BACKLOG ? null : daysFromNow(-8 + index),
          dueDate: daysFromNow(seed.dueOffset),
          completedAt: seed.completedAt ?? null,
          blockedReason: seed.blockedReason ?? null,
          isUrgent: projectIndex === 0 && seed.status === TaskStatus.EM_DESENVOLVIMENTO,
          order: index,
        }),
      );
    }

    const overdueTask = createdTasks.find((task) => task.status === TaskStatus.CONCLUIDA) ?? createdTasks[0];
    await ensureTimeLog({
      projectId: project.id,
      taskId: overdueTask.id,
      userId: overdueTask.assigneeId,
      hours: 2.5,
      description: 'Apontamento inicial criado pelo seed para validar relatorios.',
      date: daysFromNow(-1),
      status: overdueTask.status,
    });

    await ensureNotification({
      userId: admin.id,
      type: NotificationType.PROJECT_UPDATED,
      title: 'Projeto atualizado',
      message: `O projeto ${project.name} recebeu dados de validacao para o fluxo interno.`,
      relatedProjectId: project.id,
    });

    await ensureNotification({
      userId: developers[0].id,
      type: NotificationType.TASK_ASSIGNED,
      title: 'Nova task atribuida',
      message: `Uma tarefa do projeto ${project.name} foi atribuida para voce.`,
      relatedTaskId: createdTasks[0].id,
      relatedProjectId: project.id,
    });
  }

  console.log('Seed concluido: usuarios, empresas, projetos, fila, modulos, epics, tarefas, horas e notificacoes preparados.');
}

ensureTenants()
  .then(() => TenantContext.run(TENANT_IDS.DESENVOLVIMENTO, () => main()))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await base.$disconnect();
  });
