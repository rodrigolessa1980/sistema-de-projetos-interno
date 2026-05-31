export interface UserPermissionProps {
  id?: string;
  userId: string;
  module: string;
  action: string;
  granted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserPermission {
  private props: Required<UserPermissionProps>;

  constructor(props: UserPermissionProps) {
    this.props = {
      id: props.id || '',
      userId: props.userId,
      module: props.module,
      action: props.action,
      granted: props.granted,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get userId(): string { return this.props.userId; }
  public get module(): string { return this.props.module; }
  public get action(): string { return this.props.action; }
  public get granted(): boolean { return this.props.granted; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
