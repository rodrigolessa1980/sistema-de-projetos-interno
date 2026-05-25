import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { DomainException } from '../../../core/domain/exceptions/domain.exception';
export declare class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost): void;
}
