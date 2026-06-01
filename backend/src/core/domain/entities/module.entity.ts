export interface ModuleProps {
  id?: string;
  projectId: string;
  name: string;
  description: string;
  order?: number;
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Module {
  private props: Required<ModuleProps>;

  constructor(props: ModuleProps) {
    this.props = {
      id: props.id || '',
      projectId: props.projectId,
      name: props.name,
      description: props.description,
      order: props.order ?? 0,
      progress: props.progress ?? 0,
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
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
