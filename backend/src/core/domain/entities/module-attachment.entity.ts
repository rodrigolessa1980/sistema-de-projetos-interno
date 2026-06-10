export interface ModuleAttachmentProps {
  id?: string;
  moduleId: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  createdAt?: Date;
}

export class ModuleAttachment {
  private props: Required<ModuleAttachmentProps>;

  constructor(props: ModuleAttachmentProps) {
    this.props = {
      id: props.id || '',
      moduleId: props.moduleId,
      userId: props.userId,
      name: props.name,
      type: props.type,
      size: props.size,
      dataUrl: props.dataUrl,
      createdAt: props.createdAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get moduleId(): string { return this.props.moduleId; }
  public get userId(): string { return this.props.userId; }
  public get name(): string { return this.props.name; }
  public get type(): string { return this.props.type; }
  public get size(): number { return this.props.size; }
  public get dataUrl(): string { return this.props.dataUrl; }
  public get createdAt(): Date { return this.props.createdAt; }
}
