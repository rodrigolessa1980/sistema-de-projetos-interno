export interface SubtaskProps {
  id?: string;
  taskId: string;
  title: string;
  completed?: boolean;
  assigneeId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Subtask {
  private props: Required<Omit<SubtaskProps, 'assigneeId'>> & { assigneeId: string | null };

  constructor(props: SubtaskProps) {
    this.props = {
      id: props.id || '',
      taskId: props.taskId,
      title: props.title,
      completed: props.completed ?? false,
      assigneeId: props.assigneeId ?? null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get taskId(): string { return this.props.taskId; }
  public get title(): string { return this.props.title; }
  public get completed(): boolean { return this.props.completed; }
  public get assigneeId(): string | null { return this.props.assigneeId; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
