/**
 * Compatibilidade: os limites de projeto agora vivem na fonte única
 * `../field-limits`. Este arquivo apenas reexporta para não quebrar imports.
 */
import { LIMITS } from '../field-limits';

export { HEX_COLOR } from '../field-limits';
export const PROJECT_LIMITS = LIMITS.project;
