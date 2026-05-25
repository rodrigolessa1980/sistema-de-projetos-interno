import { TaskStatus } from './enums';

export interface TimeLogProps {
  id?: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string;
  date: Date;
  status: TaskStatus;
  createdAt?: Date;
}

export class TimeLog {
  private props: Required<TimeLogProps>;

  constructor(props: TimeLogProps) {
    this.props = {
      id: props.id || '',
      taskId: props.taskId,
      userId: props.userId,
      hours: props.hours,
      description: props.description,
      date: props.date,
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
  public get taskId(): string { return this.props.taskId; }
  public get userId(): string { return this.props.userId; }
  public get hours(): number { return this.props.hours; }
  public get description(): string { return this.props.description; }
  public get date(): Date { return this.props.date; }
  public get status(): TaskStatus { return this.props.status; }
  public get createdAt(): Date { return this.props.createdAt; }
}
