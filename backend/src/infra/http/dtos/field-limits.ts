/**
 * FONTE ÚNICA de limites de tamanho de campo do backend.
 *
 * ESPELHA `backend/prisma/schema.prisma` e o gêmeo do frontend
 * `src/lib/field-limits.ts`. Ao mudar um `@db.VarChar(N)` / `@db.Text` no
 * schema, atualize os TRÊS lugares — foi a falta dessa sincronia que fazia o
 * Prisma estourar 500 cru (ex.: `requestedBy` acima de 150 chars).
 *
 * Campos `@db.Text` no MySQL cabem em 65.535 BYTES. Como um caractere utf8mb4
 * ocupa até 4 bytes, usamos 16.000 caracteres como teto seguro (16.000 × 4 =
 * 64.000 < 65.535) — folgado para textos longos e impossível de estourar.
 */
export const TEXT_MAX = 16_000;

export const LIMITS = {
  project: {
    name: 150, // VarChar(150)
    description: TEXT_MAX, // @db.Text
    technicalDescription: TEXT_MAX, // @db.Text
    demandDescription: TEXT_MAX, // @db.Text
    requestedBy: 150, // VarChar(150)
    testUrl: 255, // VarChar(255)
    estimatedHoursMax: 1_000_000, // Int
  },
  company: {
    name: 100, // VarChar(100)
    shortName: 10, // VarChar(10)
    cnpj: 18, // VarChar(18)
  },
  user: {
    name: 100, // VarChar(100)
    email: 150, // VarChar(150)
    position: 100, // VarChar(100)
    department: 100, // VarChar(100)
    passwordMin: 6,
    passwordMax: 128, // bcrypt trunca em 72 bytes; 128 é teto de UX seguro
  },
  module: {
    name: 100, // VarChar(100)
    description: TEXT_MAX, // @db.Text
  },
  epic: {
    name: 100, // VarChar(100)
    description: TEXT_MAX, // @db.Text
  },
  task: {
    title: 200, // VarChar(200)
    description: TEXT_MAX, // @db.Text
    blockedReason: TEXT_MAX, // @db.Text
    complexityMin: 1,
    complexityMax: 100,
    estimatedHoursMax: 1_000_000, // Int
  },
  timeLog: {
    description: TEXT_MAX, // @db.Text
  },
  attachment: {
    name: 150, // VarChar(150)
    type: 100, // VarChar(100)
  },
  comment: {
    content: TEXT_MAX, // @db.Text
  },
  taskNote: {
    content: TEXT_MAX, // @db.Text
  },
  subtask: {
    title: 200, // VarChar(200)
  },
  apiToken: {
    name: 100, // VarChar(100)
  },
} as const;

/** Cor em hex #RRGGBB (color @db.VarChar(7)). */
export const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
