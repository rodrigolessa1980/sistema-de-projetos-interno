export interface CompanyProps {
  id?: string;
  name: string;
  shortName: string;
  color: string;
  cnpj?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Company {
  private props: Required<CompanyProps>;

  constructor(props: CompanyProps) {
    this.props = {
      id: props.id || '',
      name: props.name,
      shortName: props.shortName,
      color: props.color || '#6366f1',
      cnpj: props.cnpj || null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
    this.validate();
  }

  private validate() {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Nome da empresa é obrigatório.');
    }
    if (!this.props.shortName || this.props.shortName.trim().length === 0) {
      throw new Error('Sigla da empresa é obrigatória.');
    }
  }

  public get id(): string { return this.props.id; }
  public get name(): string { return this.props.name; }
  public get shortName(): string { return this.props.shortName; }
  public get color(): string { return this.props.color; }
  public get cnpj(): string | null { return this.props.cnpj; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
