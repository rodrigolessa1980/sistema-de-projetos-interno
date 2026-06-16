import { createHash, randomBytes } from 'node:crypto';
import { API_TOKEN_PREFIX } from '../domain/entities/api-token.entity';

export function generateApiTokenValue(): string {
  return `${API_TOKEN_PREFIX}${randomBytes(32).toString('base64url')}`;
}

export function hashApiToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function extractApiTokenPrefix(token: string): string {
  return token.slice(0, Math.min(16, token.length));
}

export function isApiToken(value: string): boolean {
  return value.startsWith(API_TOKEN_PREFIX);
}
