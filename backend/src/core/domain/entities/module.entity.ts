import { ModuleStatus } from './enums';

export interface ModuleProps {
  id?: string;
  projectId: string;
  name: string;
  description: string;
  status?: ModuleStatus;
  order?: number;
  progress?: number;
  workDate?: Date | null;
  loggedHours?: number | null;
  loggedByUserId?: string | null;
  createdById?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Module {
  private props: Required<Omit<ModuleProps, 'workDate' | 'loggedHours' | 'loggedByUserId' | 'createdById'>> & {
    workDate: Date | null;
    loggedHours: number | null;
    loggedByUserId: string | null;
    createdById: string | null;
  };

  constructor(props: ModuleProps) {
    this.props = {
      id: props.id || '',
      projectId: props.projectId,
      name: props.name,
      description: props.description,
      status: props.status ?? ModuleStatus.INICIADO,
      order: props.order ?? 0,
      progress: props.progress ?? 0,
      workDate: props.workDate ?? null,
      loggedHours: props.loggedHours ?? null,
      loggedByUserId: props.loggedByUserId ?? null,
      createdById: props.createdById ?? null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get projectId(): string { return this.props.projectId; }
  public get name(): string { return this.props.name; }
  public get description(): string { return this.props.description; }
  public get status(): ModuleStatus { return this.props.status; }
  public get order(): number { return this.props.order; }
  public get progress(): number { return this.props.progress; }
  public get workDate(): Date | null { return this.props.workDate; }
  public get loggedHours(): number | null { return this.props.loggedHours; }
  public get loggedByUserId(): string | null { return this.props.loggedByUserId; }
  public get createdById(): string | null { return this.props.createdById; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
