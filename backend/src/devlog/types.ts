import { ModuleStatus, ProjectStatus } from '../core/domain/entities/enums';

export interface DevlogModuleEntry {
  name: string;
  description?: string;
  status?: ModuleStatus;
  order?: number;
  /** Horas trabalhadas — registra time log na criação do módulo */
  hours?: number;
  /** Data do trabalho (YYYY-MM-DD) — obrigatória se hours for informado */
  workDate?: string;
}

export interface DevlogProjectEntry {
  name: string;
  description?: string;
  status?: ProjectStatus;
  color?: string;
  estimatedHours?: number;
  startDate?: string;
  endDate?: string | null;
  companyName?: string;
  modules?: DevlogModuleEntry[];
}

export interface DevlogManifest {
  /** E-mail do responsável pelos projetos (owner). Usa o primeiro admin se omitido. */
  ownerEmail?: string;
  /** Projetos removidos antes da importação (match por nome exato). */
  cleanupProjects?: string[];
  /** Remove módulos seed genéricos sem horas registradas nos projetos importados. */
  removeSeedModules?: boolean;
  /** Escopo da remoção de seed (padrão: nomes em projects). Usado pelo import em lote. */
  removeSeedModulesForProjects?: string[];
  projects: DevlogProjectEntry[];
}

export interface DevlogImportResult {
  ownerId: string;
  projectsCreated: number;
  projectsUpdated: number;
  modulesCreated: number;
  modulesUpdated: number;
  modulesSkipped: number;
  timeLogsCreated: number;
  projectsRemoved: number;
  seedModulesRemoved: number;
  details: string[];
}
