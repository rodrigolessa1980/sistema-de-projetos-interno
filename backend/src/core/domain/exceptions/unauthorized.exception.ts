import { DomainException } from './domain.exception';

export class UnauthorizedException extends DomainException {
  constructor(message = 'Credenciais inválidas.') {
    super(message, 'UNAUTHORIZED');
  }
}
