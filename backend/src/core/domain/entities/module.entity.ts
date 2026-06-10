export interface ModuleProps {
  id?: string;
  projectId: string;
  name: string;
  description: string;
  order?: number;
  progress?: number;
  workDate?: Date | null;
  loggedHours?: number | null;
  loggedByUserId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Module {
  private props: Required<Omit<ModuleProps, 'workDate' | 'loggedHours' | 'loggedByUserId'>> & {
    workDate: Date | null;
    loggedHours: number | null;
    loggedByUserId: string | null;
  };

  constructor(props: ModuleProps) {
    this.props = {
      id: props.id || '',
      projectId: props.projectId,
      name: props.name,
      description: props.description,
      order: props.order ?? 0,
      progress: props.progress ?? 0,
      workDate: props.workDate ?? null,
      loggedHours: props.loggedHours ?? null,
      loggedByUserId: props.loggedByUserId ?? null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get projectId(): string { return this.props.projectId; }
  public get name(): string { return this.props.name; }
  public get description(): string { return this.props.description; }
  public get order(): number { return this.props.order; }
  public get progress(): number { return this.props.progress; }
  public get workDate(): Date | null { return this.props.workDate; }
  public get loggedHours(): number | null { return this.props.loggedHours; }
  public get loggedByUserId(): string | null { return this.props.loggedByUserId; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
