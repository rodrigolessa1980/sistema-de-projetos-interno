/**
 * FONTE ÚNICA de limites de tamanho de campo do frontend.
 *
 * ESPELHA o backend: `backend/prisma/schema.prisma` e
 * `backend/src/infra/http/dtos/field-limits.ts`. MANTER EM SINCRONIA.
 *
 * O front usa estes valores para bloquear (via `maxLength` + zod) e avisar
 * (contador + mensagem) ANTES de enviar; o backend rejeita com a mesma regra.
 * Assim o usuário sempre sabe, no próprio campo, se o valor é válido.
 *
 * `@db.Text` cabe em 65.535 bytes; 16.000 caracteres é teto seguro em utf8mb4.
 */
export const TEXT_MAX = 16_000;

export const FIELD_LIMITS = {
  project: {
    name: 150,
    description: TEXT_MAX,
    requestedBy: 150,
    testUrl: 255,
    estimatedHoursMax: 1_000_000,
  },
  company: {
    name: 100,
    shortName: 10,
    cnpj: 18,
  },
  user: {
    name: 100,
    email: 150,
    position: 100,
    department: 100,
    passwordMin: 6,
    passwordMax: 128,
  },
  module: {
    name: 100,
    description: TEXT_MAX,
  },
  epic: {
    name: 100,
    description: TEXT_MAX,
  },
  task: {
    title: 200,
    description: TEXT_MAX,
    blockedReason: TEXT_MAX,
    complexityMin: 1,
    complexityMax: 100,
    estimatedHoursMax: 1_000_000,
  },
  timeLog: {
    description: TEXT_MAX,
  },
  attachment: {
    name: 150,
    type: 100,
  },
  apiToken: {
    name: 100,
  },
} as const;

/** Alias de compatibilidade — o formulário de projetos já usa este nome. */
export const PROJECT_FIELD_LIMITS = FIELD_LIMITS.project;

/** Cor em hex #RRGGBB (color @db.VarChar(7)). */
export const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
