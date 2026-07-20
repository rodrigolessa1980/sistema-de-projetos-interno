export interface CommentProps {
  id?: string;
  taskId: string;
  userId: string;
  content: string;
  mentions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Comment {
  private props: Required<CommentProps>;

  constructor(props: CommentProps) {
    this.props = {
      id: props.id || '',
      taskId: props.taskId,
      userId: props.userId,
      content: props.content,
      mentions: props.mentions ?? [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get taskId(): string { return this.props.taskId; }
  public get userId(): string { return this.props.userId; }
  public get content(): string { return this.props.content; }
  public get mentions(): string[] { return this.props.mentions; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
