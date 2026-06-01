import { ProjectStatus } from './enums';

export interface EpicProps {
  id?: string;
  projectId: string;
  moduleId: string;
  name: string;
  description: string;
  status?: ProjectStatus;
  startDate: Date;
  endDate?: Date | null;
  progress?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Epic {
  private props: Required<EpicProps>;

  constructor(props: EpicProps) {
    this.props = {
      id: props.id || '',
      projectId: props.projectId,
      moduleId: props.moduleId,
      name: props.name,
      description: props.description,
      status: props.status ?? ProjectStatus.ATIVO,
      startDate: props.startDate,
      endDate: props.endDate ?? null,
      progress: props.progress ?? 0,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get projectId(): string { return this.props.projectId; }
  public get moduleId(): string { return this.props.moduleId; }
  public get name(): string { return this.props.name; }
  public get description(): string { return this.props.description; }
  public get status(): ProjectStatus { return this.props.status; }
  public get startDate(): Date { return this.props.startDate; }
  public get endDate(): Date | null { return this.props.endDate; }
  public get progress(): number { return this.props.progress; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
