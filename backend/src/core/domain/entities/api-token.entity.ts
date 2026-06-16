export const API_TOKEN_PREFIX = 'df_';

export interface ApiTokenProps {
  id?: string;
  userId: string;
  name: string;
  tokenHash: string;
  tokenPrefix: string;
  scopes: string[];
  expiresAt?: Date | null;
  lastUsedAt?: Date | null;
  revokedAt?: Date | null;
  createdAt?: Date;
}

export class ApiToken {
  private props: Required<Omit<ApiTokenProps, 'expiresAt' | 'lastUsedAt' | 'revokedAt'>> & {
    expiresAt: Date | null;
    lastUsedAt: Date | null;
    revokedAt: Date | null;
  };

  constructor(props: ApiTokenProps) {
    this.props = {
      id: props.id ?? '',
      userId: props.userId,
      name: props.name,
      tokenHash: props.tokenHash,
      tokenPrefix: props.tokenPrefix,
      scopes: props.scopes ?? [],
      expiresAt: props.expiresAt ?? null,
      lastUsedAt: props.lastUsedAt ?? null,
      revokedAt: props.revokedAt ?? null,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get name(): string { return this.props.name; }
  get tokenHash(): string { return this.props.tokenHash; }
  get tokenPrefix(): string { return this.props.tokenPrefix; }
  get scopes(): string[] { return this.props.scopes; }
  get expiresAt(): Date | null { return this.props.expiresAt; }
  get lastUsedAt(): Date | null { return this.props.lastUsedAt; }
  get revokedAt(): Date | null { return this.props.revokedAt; }
  get createdAt(): Date { return this.props.createdAt; }

  isActive(now = new Date()): boolean {
    if (this.props.revokedAt) return false;
    if (this.props.expiresAt && this.props.expiresAt <= now) return false;
    return true;
  }
}
