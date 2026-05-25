import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} com id "${id}" não encontrado.` : `${resource} não encontrado.`,
      'NOT_FOUND',
    );
  }
}
