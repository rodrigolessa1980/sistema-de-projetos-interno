import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../../core/domain/exceptions/domain.exception';

/** Mapa de nomes de coluna do banco -> rótulo amigável exibido ao usuário. */
const COLUMN_LABELS: Record<string, string> = {
  requestedBy: 'Solicitado por',
  name: 'Nome',
  description: 'Descrição',
  technicalDescription: 'Descrição técnica',
  demandDescription: 'Descrição da demanda',
  testUrl: 'URL de teste',
  color: 'Cor',
  title: 'Título',
  email: 'E-mail',
  shortName: 'Sigla',
};

const friendlyColumn = (column?: unknown): string | null => {
  if (typeof column !== 'string' || !column) return null;
  return COLUMN_LABELS[column] ?? column;
};

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response.status(status).json(body);
      return;
    }

    if (exception instanceof DomainException) {
      const statusMap: Record<string, HttpStatus> = {
        NOT_FOUND: HttpStatus.NOT_FOUND,
        UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
        CONFLICT: HttpStatus.CONFLICT,
      };
      const status = statusMap[exception.code] ?? HttpStatus.BAD_REQUEST;
      response.status(status).json({
        statusCode: status,
        code: exception.code,
        message: exception.message,
      });
      return;
    }

    // Erros conhecidos do Prisma (P####). Duck-typing evita acoplar o filtro ao
    // client gerado. Sem este bloco, caíam no 500 abaixo e vazavam a mensagem
    // crua "Invalid `prisma.project.create()` invocation..." para o usuário.
    const prismaCode = (exception as { code?: unknown } | null)?.code;
    if (typeof prismaCode === 'string' && /^P\d{4}$/.test(prismaCode)) {
      const meta = (exception as { meta?: Record<string, unknown> }).meta ?? {};
      const { status, message } = this.mapPrismaError(prismaCode, meta);
      this.logger.warn(
        `Prisma ${prismaCode} em ${request.method} ${request.url}: ${message}`,
      );
      response.status(status).json({ statusCode: status, code: prismaCode, message });
      return;
    }

    // Erro de validação do Prisma (formato/tipo inválido na query).
    if (exception instanceof Error && exception.name === 'PrismaClientValidationError') {
      this.logger.error(
        `PrismaClientValidationError em ${request.method} ${request.url}`,
        exception.stack,
      );
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Dados inválidos enviados ao servidor. Verifique os campos e tente novamente.',
      });
      return;
    }

    // Erro genuinamente inesperado: loga o detalhe COMPLETO no servidor, mas
    // NUNCA devolve a mensagem crua ao cliente (evita vazamento e "erro vago").
    this.logger.error(
      `Unhandled exception on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Ocorreu um erro interno no servidor. Tente novamente em instantes.',
    });
  }

  /** Traduz o código do Prisma em status HTTP + mensagem clara em pt-BR. */
  private mapPrismaError(
    code: string,
    meta: Record<string, unknown>,
  ): { status: HttpStatus; message: string } {
    switch (code) {
      case 'P2000': {
        // Valor longo demais para a coluna.
        const label = friendlyColumn(meta.column_name);
        return {
          status: HttpStatus.BAD_REQUEST,
          message: label
            ? `O texto informado em "${label}" é longo demais. Reduza o conteúdo e tente novamente.`
            : 'Um dos campos tem texto longo demais. Reduza o conteúdo e tente novamente.',
        };
      }
      case 'P2002': {
        // Violação de unicidade.
        const target = meta.target;
        const fields = Array.isArray(target)
          ? target.map((f) => friendlyColumn(f) ?? f).join(', ')
          : friendlyColumn(target);
        return {
          status: HttpStatus.CONFLICT,
          message: fields
            ? `Já existe um registro com este valor de ${fields}.`
            : 'Já existe um registro com este valor.',
        };
      }
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Referência inválida: um registro relacionado não existe ou não pôde ser vinculado.',
        };
      case 'P2011':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Um campo obrigatório não foi preenchido.',
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado. Ele pode ter sido removido por outro usuário.',
        };
      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível concluir a operação no banco de dados. Verifique os dados e tente novamente.',
        };
    }
  }
}
