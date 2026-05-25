import { ProjectStatus } from './enums';

export interface ProjectProps {
  id?: string;
  companyId: string;
  name: string;
  description: string;
  status?: ProjectStatus;
  ownerId: string;
  startDate: Date;
  endDate?: Date | null;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  color?: string;
  avatar?: string | null;
  testUrl?: string | null;
  queueOrder?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Project {
  private props: Required<ProjectProps>;

  constructor(props: ProjectProps) {
    this.props = {
      id: props.id || '',
      companyId: props.companyId,
      name: props.name,
      description: props.description,
      status: props.status || ProjectStatus.NA_FILA,
      ownerId: props.ownerId,
      startDate: props.startDate,
      endDate: props.endDate || null,
      estimatedHours: props.estimatedHours || 0,
      actualHours: props.actualHours || 0.0,
      progress: props.progress || 0,
      color: props.color || '#6366f1',
      avatar: props.avatar || null,
      testUrl: props.testUrl || null,
      queueOrder: props.queueOrder === undefined ? null : props.queueOrder,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
    this.validate();
  }

  private validate() {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Nome do projeto é obrigatório.');
    }
    if (this.props.estimatedHours < 0) {
      throw new Error('As horas estimadas não podem ser negativas.');
    }
    if (this.props.progress < 0 || this.props.progress > 100) {
      throw new Error('O progresso do projeto deve estar entre 0 e 100.');
    }
  }

  public get id(): string { return this.props.id; }
  public get companyId(): string { return this.props.companyId; }
  public get name(): string { return this.props.name; }
  public get description(): string { return this.props.description; }
  public get status(): ProjectStatus { return this.props.status; }
  public get ownerId(): string { return this.props.ownerId; }
  public get startDate(): Date { return this.props.startDate; }
  public get endDate(): Date | null { return this.props.endDate; }
  public get estimatedHours(): number { return this.props.estimatedHours; }
  public get actualHours(): number { return this.props.actualHours; }
  public get progress(): number { return this.props.progress; }
  public get color(): string { return this.props.color; }
  public get avatar(): string | null { return this.props.avatar; }
  public get testUrl(): string | null { return this.props.testUrl; }
  public get queueOrder(): number | null { return this.props.queueOrder; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }

  public updateProgress(progress: number) {
    if (progress < 0 || progress > 100) {
      throw new Error('O progresso deve estar entre 0 e 100.');
    }
    this.props.progress = progress;
    this.props.updatedAt = new Date();
  }

  public setQueueOrder(order: number | null) {
    this.props.queueOrder = order;
    this.props.updatedAt = new Date();
  }

  public updateHours(actualHours: number) {
    this.props.actualHours = Number(actualHours.toFixed(2));
    this.props.updatedAt = new Date();
  }
}
