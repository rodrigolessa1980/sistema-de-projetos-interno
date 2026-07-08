export interface TenantProps {
  id: string;
  name: string;
  slug: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Tenant {
  private props: Required<TenantProps>;

  constructor(props: TenantProps) {
    this.props = {
      id: props.id,
      name: props.name,
      slug: props.slug,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string { return this.props.id; }
  public get name(): string { return this.props.name; }
  public get slug(): string { return this.props.slug; }
  public get isActive(): boolean { return this.props.isActive; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
