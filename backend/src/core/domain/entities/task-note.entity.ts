export interface TaskNoteProps {
  id?: string;
  taskId: string;
  userId: string;
  content: string;
  isPinned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TaskNote {
  private props: Required<TaskNoteProps>;

  constructor(props: TaskNoteProps) {
    this.props = {
      id: props.id || '',
      taskId: props.taskId,
      userId: props.userId,
      content: props.content,
      isPinned: props.isPinned ?? false,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get taskId(): string { return this.props.taskId; }
  public get userId(): string { return this.props.userId; }
  public get content(): string { return this.props.content; }
  public get isPinned(): boolean { return this.props.isPinned; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
