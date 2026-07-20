import { ModuleStatus, TaskStatus } from '../entities/enums';

/**
 * Regra ÚNICA de derivação da hierarquia do DevFlow: `Projeto ⊃ Módulo ⊃ Tarefa`.
 *
 * Estado e progresso fluem só de baixo para cima — a tarefa é a fonte de
 * verdade, o módulo deriva das suas tarefas e o projeto deriva dos seus módulos.
 * Nenhum caminho (kanban, import, criação de módulo, reconciliação) escreve
 * status de módulo "na mão": todos chamam estas funções. Manter isto aqui, no
 * domínio, é o que garante que a invariante valha em TODA a aplicação.
 */

/** Progresso (0–100) associado a cada status de módulo. */
export const MODULE_PROGRESS: Record<ModuleStatus, number> = {
  [ModuleStatus.INICIADO]: 0,
  [ModuleStatus.EM_PROCESSO]: 50,
  [ModuleStatus.CONCLUIDO]: 100,
};

/**
 * Deriva o status de um módulo a partir dos status das suas tarefas:
 *  - ≥1 concluída e nenhuma pendente          -> CONCLUIDO
 *  - alguma concluída OU em andamento/bloqueada -> EM_PROCESSO
 *  - só backlog/planejada                       -> INICIADO
 *
 * CANCELADA é ignorada (não conta como pendente nem como concluída): uma tarefa
 * cancelada não impede o módulo de concluir.
 *
 * Retorna `null` quando o módulo não tem tarefas — não há do que derivar, então
 * o chamador preserva o status atual (não zera módulo de planejamento vazio).
 */
export function deriveModuleStatus(statuses: TaskStatus[]): ModuleStatus | null {
  if (statuses.length === 0) return null;
  const done = statuses.filter((s) => s === TaskStatus.CONCLUIDA).length;
  const pending = statuses.filter(
    (s) => s !== TaskStatus.CONCLUIDA && s !== TaskStatus.CANCELADA,
  ).length;
  if (done > 0 && pending === 0) return ModuleStatus.CONCLUIDO;
  const active = statuses.some(
    (s) =>
      s === TaskStatus.EM_DESENVOLVIMENTO ||
      s === TaskStatus.EM_REVISAO ||
      s === TaskStatus.HOMOLOGACAO ||
      s === TaskStatus.BLOQUEADA,
  );
  return done > 0 || active ? ModuleStatus.EM_PROCESSO : ModuleStatus.INICIADO;
}

/** Progresso derivado (0/50/100) de um módulo, ou `null` se ele não tem tarefas. */
export function deriveModuleProgress(statuses: TaskStatus[]): number | null {
  const status = deriveModuleStatus(statuses);
  return status === null ? null : MODULE_PROGRESS[status];
}

/**
 * Progresso do projeto (0–100) = média do progresso dos módulos PONDERADA pelo
 * número de tarefas de cada módulo. Módulos maiores (mais tarefas) pesam mais,
 * então o card do projeto reflete o volume real de trabalho, não a contagem de
 * módulos. Ponderamos por tarefas — e não por horas — porque horas são
 * estimadas/`null` demais para servir de peso confiável.
 *
 * Sem nenhuma tarefa em nenhum módulo, cai para a média simples do progresso
 * (0 se não houver módulos), evitando divisão por zero.
 */
export function deriveProjectProgress(
  modules: Array<{ progress: number; taskCount: number }>,
): number {
  if (modules.length === 0) return 0;
  const totalTasks = modules.reduce((sum, m) => sum + m.taskCount, 0);
  if (totalTasks === 0) {
    return Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length);
  }
  const weighted = modules.reduce((sum, m) => sum + m.progress * m.taskCount, 0);
  return Math.round(weighted / totalTasks);
}
