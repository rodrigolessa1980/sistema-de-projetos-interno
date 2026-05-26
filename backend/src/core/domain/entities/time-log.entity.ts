import { TaskStatus, TimeLogSource } from './enums';

export interface TimeLogProps {
  id?: string;
  projectId: string;
  taskId: string;
  userId: string;
  hours: number;
  durationSeconds?: number | null;
  description: string;
  date: Date;
  startedAt?: Date | null;
  endedAt?: Date | null;
  source?: TimeLogSource;
  status: TaskStatus;
  createdAt?: Date;
}

export class TimeLog {
  private props: Required<TimeLogProps>;

  constructor(props: TimeLogProps) {
    this.props = {
      id: props.id || '',
      projectId: props.projectId,
      taskId: props.taskId,
      userId: props.userId,
      hours: props.hours,
      durationSeconds: props.durationSeconds || null,
      description: props.description,
      date: props.date,
      startedAt: props.startedAt || null,
      endedAt: props.endedAt || null,
      source: props.source || TimeLogSource.MANUAL,
      status: props.status,
      createdAt: props.createdAt || new Date(),
    };
    this.validate();
  }

  private validate() {
    if (this.props.hours <= 0) {
      throw new Error('As horas registradas devem ser maiores que zero.');
    }
    if (!this.props.description || this.props.description.trim().length === 0) {
      throw new Error('A descrição do log de tempo é obrigatória.');
    }
  }

  public get id(): string { return this.props.id; }
  public get projectId(): string { return this.props.projectId; }
  public get taskId(): string { return this.props.taskId; }
  public get userId(): string { return this.props.userId; }
  public get hours(): number { return this.props.hours; }
  public get durationSeconds(): number | null { return this.props.durationSeconds; }
  public get description(): string { return this.props.description; }
  public get date(): Date { return this.props.date; }
  public get startedAt(): Date | null { return this.props.startedAt; }
  public get endedAt(): Date | null { return this.props.endedAt; }
  public get source(): TimeLogSource { return this.props.source; }
  public get status(): TaskStatus { return this.props.status; }
  public get createdAt(): Date { return this.props.createdAt; }
}
