export type UserRole = "ADMIN" | "DEVELOPER";

export type TaskStatus =
  | "BACKLOG"
  | "PLANEJADA"
  | "BLOQUEADA"
  | "EM_DESENVOLVIMENTO"
  | "EM_REVISAO"
  | "HOMOLOGACAO"
  | "CONCLUIDA"
  | "CANCELADA";

export type TaskComplexity = 1 | 2 | 3 | 5 | 8;

export type ProjectStatus = "ATIVO" | "PAUSADO" | "CONCLUIDO" | "CANCELADO" | "NA_FILA";

export type ModuleStatus = "INICIADO" | "EM_PROCESSO" | "CONCLUIDO";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_BLOCKED"
  | "TASK_COMPLETED"
  | "TASK_OVERDUE"
  | "COMMENT_ADDED"
  | "DEPENDENCY_RESOLVED"
  | "PROJECT_UPDATED";

export type AuditAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "STATUS_CHANGED"
  | "ASSIGNED"
  | "COMMENTED"
  | "TIME_LOGGED";

export interface Company {
  id: string;
  name: string;
  /** Sigla/abreviação exibida nos badges */
  shortName: string;
  /** Cor de destaque em hex */
  color: string;
  cnpj?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermission {
  module: string;
  action: string;
  granted: boolean;
}

export interface User {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  position: string;
  department: string;
  isApproved?: boolean;
  projectIds: string[];
  permissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
}

export interface TenantOption {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  /** Empresa do grupo à qual o projeto pertence */
  companyId?: string | null;
  name: string;
  description: string;
  technicalDescription?: string | null;
  demandDescription?: string | null;
  requestedBy?: string | null;
  status: ProjectStatus;
  ownerId: string;
  developerIds: string[];
  startDate: string;
  endDate?: string | null;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  color: string;
  avatar?: string;
  testUrl?: string | null;
  /** Posição na fila de desenvolvimento (1 = primeiro). Ausente = não está na fila. */
  queueOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: ModuleStatus;
  order: number;
  progress: number;
  workDate?: string | null;
  loggedHours?: number | null;
  loggedByUserId?: string | null;
  /** Autor/dono do módulo (quem criou). Base da regra admin-ou-dono. */
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleAttachment {
  id: string;
  moduleId: string;
  userId: string;
  name: string;
  /** MIME type */
  type: string;
  /** Tamanho em bytes */
  size: number;
  /** Base64 data URL */
  dataUrl: string;
  createdAt: string;
}

export interface ProjectShowcaseAttachment {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  /** MIME type */
  type: string;
  /** Tamanho em bytes */
  size: number;
  /** Base64 data URL */
  dataUrl: string;
  createdAt: string;
}

export interface ProjectDemandAttachment {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  /** MIME type */
  type: string;
  /** Tamanho em bytes */
  size: number;
  /** Base64 data URL */
  dataUrl: string;
  createdAt: string;
}

export interface Epic {
  id: string;
  projectId: string;
  moduleId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  progress: number;
  developerIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  moduleId: string;
  epicId: string;
  parentTaskId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  complexity: TaskComplexity;
  assigneeId: string;
  reporterId: string;
  estimatedHours: number;
  actualHours: number;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  dependencyIds: string[];
  tags: string[];
  order: number;
  blockedReason?: string;
  /** Tarefa marcada como urgente — bloqueia todas as demais do mesmo dev */
  isUrgent?: boolean;
  /** ID da tarefa urgente que bloqueou esta tarefa */
  urgentBlockedById?: string;
  /** Status anterior ao bloqueio por urgência, para restaurar depois */
  urgentPreviousStatus?: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  type: "BLOCKS" | "BLOCKED_BY" | "RELATED";
  createdAt: string;
}

export interface TimeLog {
  id: string;
  projectId: string;
  taskId: string;
  userId: string;
  hours: number;
  durationSeconds?: number | null;
  description: string;
  date: string;
  startedAt?: string | null;
  endedAt?: string | null;
  source?: "TIMER" | "MANUAL";
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string; // INC-11: carimbo de modificação p/ delta sync
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[];
  /** Soft delete: preenchido = comentário apagado (mostra "apagado" na thread). */
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedTaskId?: string;
  relatedProjectId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  entityType: "TASK" | "PROJECT" | "MODULE" | "EPIC" | "USER";
  entityId: string;
  action: AuditAction;
  userId: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  description: string;
  createdAt: string;
}

export interface StatusHistory {
  id: string;
  taskId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  userId: string;
  duration: number;
  createdAt: string;
}

export interface MetricSummary {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  blockedTasks: number;
  totalHoursEstimated: number;
  totalHoursActual: number;
  averageLeadTime: number;
  averageCycleTime: number;
  reworkRate: number;
  estimationAccuracy: number;
  throughput: number;
}

export interface TaskNote {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  /** Markdown ou texto simples */
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  userId: string;
  name: string;
  /** MIME type */
  type: string;
  /** Tamanho em bytes */
  size: number;
  /** Base64 data URL para persistência local */
  dataUrl: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  /** Grupo (tenant) escolhido no login. */
  tenantSlug: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  /** Grupo (tenant) escolhido no cadastro. */
  tenantSlug: string;
}

export type ViewMode = "table" | "kanban" | "gantt" | "calendar";

export interface FilterState {
  status?: TaskStatus[];
  assigneeId?: string[];
  complexity?: TaskComplexity[];
  projectId?: string[];
  search?: string;
  dateRange?: { from: string; to: string };
}

export interface SortState {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
