import type { Module } from "@/types";

/**
 * Um "módulo de lançamento rápido" é criado pelo timesheet (calendário de
 * atividades / reports/daily) só para dar um lugar às horas — ele tem
 * `loggedHours` preenchido. Não é estrutura de planejamento e, portanto, deve
 * ser escondido das telas de planejamento (Kanban, Épicos, Tarefas, Gantt,
 * aba Módulos do projeto). As horas continuam contando normalmente (vêm do
 * TimeLog), só o "andaime" some do planejamento.
 */
export function isQuickLogModule(m: Pick<Module, "loggedHours">): boolean {
  return m.loggedHours != null;
}

/** Conjunto de ids dos módulos de lançamento rápido, para filtrar épicos/tarefas. */
export function quickLogModuleIds(modules: Module[]): Set<string> {
  return new Set(modules.filter(isQuickLogModule).map((m) => m.id));
}
