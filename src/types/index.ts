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
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  position: string;
  department: string;
  projectIds: string[];
  permissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  /** Empresa do grupo à qual o projeto pertence */
  companyId?: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  developerIds: string[];
  startDate: string;
  endDate?: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  color: string;
  avatar?: string;
  testUrl?: string;
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
  order: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
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
  taskId: string;
  userId: string;
  hours: number;
  description: string;
  date: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[];
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
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  role?: UserRole;
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
