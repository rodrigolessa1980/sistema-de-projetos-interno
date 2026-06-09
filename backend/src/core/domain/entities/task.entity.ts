import { TaskStatus } from './enums';

export interface TaskProps {
  id?: string;
  projectId: string;
  moduleId: string;
  epicId: string;
  parentTaskId?: string | null;
  title: string;
  description: string;
  status?: TaskStatus;
  complexity?: number;
  assigneeId: string;
  reporterId: string;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: Date | null;
  dueDate?: Date | null;
  completedAt?: Date | null;
  blockedReason?: string | null;
  isUrgent?: boolean;
  urgentBlockedById?: string | null;
  urgentPreviousStatus?: TaskStatus | null;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private props: Required<TaskProps>;

  constructor(props: TaskProps) {
    this.props = {
      id: props.id || '',
      projectId: props.projectId,
      moduleId: props.moduleId,
      epicId: props.epicId,
      parentTaskId: props.parentTaskId || null,
      title: props.title,
      description: props.description,
      status: props.status || TaskStatus.BACKLOG,
      complexity: props.complexity || 1,
      assigneeId: props.assigneeId,
      reporterId: props.reporterId,
      estimatedHours: props.estimatedHours || 0,
      actualHours: props.actualHours || 0.0,
      startDate: props.startDate || null,
      dueDate: props.dueDate || null,
      completedAt: props.completedAt || null,
      blockedReason: props.blockedReason || null,
      isUrgent: props.isUrgent || false,
      urgentBlockedById: props.urgentBlockedById || null,
      urgentPreviousStatus: props.urgentPreviousStatus || null,
      order: props.order || 0,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
    this.validate();
  }

  private validate() {
    if (!this.props.title || this.props.title.trim().length === 0) {
      throw new Error('A tarefa precisa de um título válido.');
    }
    if (this.props.estimatedHours < 0) {
      throw new Error('As horas estimadas não podem ser negativas.');
    }
  }

  public get id(): string { return this.props.id; }
  public get projectId(): string { return this.props.projectId; }
  public get moduleId(): string { return this.props.moduleId; }
  public get epicId(): string { return this.props.epicId; }
  public get parentTaskId(): string | null { return this.props.parentTaskId; }
  public get title(): string { return this.props.title; }
  public get description(): string { return this.props.description; }
  public get status(): TaskStatus { return this.props.status; }
  public get complexity(): number { return this.props.complexity; }
  public get assigneeId(): string { return this.props.assigneeId; }
  public get reporterId(): string { return this.props.reporterId; }
  public get estimatedHours(): number { return this.props.estimatedHours; }
  public get actualHours(): number { return this.props.actualHours; }
  public get startDate(): Date | null { return this.props.startDate; }
  public get dueDate(): Date | null { return this.props.dueDate; }
  public get completedAt(): Date | null { return this.props.completedAt; }
  public get blockedReason(): string | null { return this.props.blockedReason; }
  public get isUrgent(): boolean { return this.props.isUrgent; }
  public get urgentBlockedById(): string | null { return this.props.urgentBlockedById; }
  public get urgentPreviousStatus(): TaskStatus | null { return this.props.urgentPreviousStatus; }
  public get order(): number { return this.props.order; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }

  public blockDueToUrgency(urgentTaskId: string): void {
    if (this.props.status === TaskStatus.CONCLUIDA || this.props.status === TaskStatus.CANCELADA) {
      return;
    }
    this.props.urgentPreviousStatus = this.props.status;
    this.props.status = TaskStatus.BLOQUEADA;
    this.props.urgentBlockedById = urgentTaskId;
    this.props.blockedReason = `Bloqueado automaticamente devido à tarefa urgente ID: ${urgentTaskId}`;
    this.props.updatedAt = new Date();
  }

  public releaseUrgencyBlock(): void {
    if (!this.props.urgentBlockedById) {
      return;
    }
    if (this.props.status === TaskStatus.BLOQUEADA) {
      this.props.status = this.props.urgentPreviousStatus || TaskStatus.BACKLOG;
    }
    this.props.urgentBlockedById = null;
    this.props.urgentPreviousStatus = null;
    this.props.blockedReason = null;
    this.props.updatedAt = new Date();
  }

  public addHours(hours: number): void {
    if (hours <= 0) throw new Error('Não é possível adicionar quantidade de horas negativa ou zero.');
    this.props.actualHours = Number((this.props.actualHours + hours).toFixed(2));
    this.props.updatedAt = new Date();
  }

  public updateStatus(status: TaskStatus): void {
    this.props.status = status;
    if (status === TaskStatus.CONCLUIDA) {
      this.props.completedAt = new Date();
    } else {
      this.props.completedAt = null;
    }
    this.props.updatedAt = new Date();
  }
}
