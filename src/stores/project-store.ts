"use client";

import { create } from "zustand";
import type { Project, Module, Epic, Company, ModuleStatus, ProjectShowcaseAttachment, ProjectDemandAttachment } from "@/types";
import type { Task, TimeLog, ModuleAttachment, Comment, Subtask, TaskDependency, TaskNote } from "@/types";
// Module and Epic are fetched from API; types re-exported for clarity
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useTaskStore } from "./task-store";
import { createDirtyTracker, replacePreservingDirty, upsertById } from "@/lib/reconcile";
import { normalizeTask, taskDirty } from "./task-store";

/**
 * Ids de projetos com mutação otimista em voo (INC-03). Compartilhado com o delta sync
 * (INC-12) para não sobrescrever edição local pendente.
 */
export const projectDirty = createDirtyTracker();

const asArray = <T,>(value: T[] | null | undefined): T[] => Array.isArray(value) ? value : [];

export const normalizeProject = (project: Project): Project => ({
  ...project,
  endDate: project.endDate ?? undefined,
  queueOrder: project.queueOrder ?? undefined,
  avatar: project.avatar ?? undefined,
  testUrl: project.testUrl ?? undefined,
  developerIds: asArray(project.developerIds),
});

export const normalizeEpic = (epic: Epic): Epic => ({
  ...epic,
  developerIds: asArray(epic.developerIds),
});

interface ProjectStore {
  projects: Project[];
  modules: Module[];
  epics: Epic[];
  companies: Company[];
  projectShowcaseAttachments: ProjectShowcaseAttachment[];
  projectDemandAttachments: ProjectDemandAttachment[];
  selectedProjectId: string | null;
  isLoading: boolean;
  /** Vira true após a 1ª tentativa de bootstrap (sucesso ou erro). Evita o
   *  "falso vazio": telas não mostram EmptyState enquanto isto for false. */
  hasLoaded: boolean;

  getCompanyById: (id: string) => Company | undefined;
  createCompany: (data: Omit<Company, "id" | "createdAt" | "updatedAt">) => Promise<Company>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<Company>;
  deleteCompany: (id: string) => Promise<void>;

  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getModulesByProject: (projectId: string) => Module[];
  getEpicsByModule: (moduleId: string) => Epic[];
  getEpicsByProject: (projectId: string) => Epic[];
  getShowcaseAttachmentsByProject: (projectId: string) => ProjectShowcaseAttachment[];
  fetchProjectShowcaseAttachments: (projectId: string) => Promise<ProjectShowcaseAttachment[]>;
  updateProjectShowcase: (projectId: string, technicalDescription: string) => Promise<Project>;
  addProjectShowcaseAttachment: (projectId: string, data: { name: string; type: string; size: number; dataUrl: string }) => Promise<ProjectShowcaseAttachment>;
  deleteProjectShowcaseAttachment: (id: string) => Promise<void>;
  getDemandAttachmentsByProject: (projectId: string) => ProjectDemandAttachment[];
  fetchProjectDemandAttachments: (projectId: string) => Promise<ProjectDemandAttachment[]>;
  updateProjectDemand: (projectId: string, demandDescription: string) => Promise<Project>;
  addProjectDemandAttachment: (projectId: string, data: { name: string; type: string; size: number; dataUrl: string }) => Promise<ProjectDemandAttachment>;
  deleteProjectDemandAttachment: (id: string) => Promise<void>;
  createProject: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  createModule: (data: {
    projectId: string;
    name: string;
    description: string;
    status?: ModuleStatus;
    order?: number;
    hours?: number;
    workDate?: string;
    assignedUserId?: string;
    attachments?: { name: string; type: string; size: number; dataUrl: string }[];
  }) => Promise<Module>;
  updateModule: (id: string, data: Partial<Module> & { hours?: number; assignedUserId?: string }) => Promise<Module>;
  deleteModule: (id: string) => Promise<void>;
  createModulesBulk: (projectId: string, modules: { name: string; description: string }[]) => Promise<Module[]>;
  createEpic: (data: Omit<Epic, "id" | "createdAt" | "updatedAt" | "status" | "progress">) => Promise<Epic>;
  updateEpic: (id: string, data: Partial<Epic>) => Promise<Epic>;
  setSelectedProject: (id: string | null) => void;
  addDeveloperToProject: (projectId: string, userId: string) => void;
  removeDeveloperFromProject: (projectId: string, userId: string) => void;

  // Fila de desenvolvimento
  getQueuedProjects: () => Project[];
  reorderQueue: (orderedIds: string[]) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  modules: [],
  epics: [],
  companies: [],
  projectShowcaseAttachments: [],
  projectDemandAttachments: [],
  selectedProjectId: null,
  isLoading: false,
  hasLoaded: false,

  getCompanyById: (id) => get().companies.find((c) => c.id === id),

  createCompany: async (data) => {
    // O id é gerado pelo servidor (como em createProject/createUserRemote). Enviar
    // um id do cliente fazia o POST ser rejeitado pelo backend (ValidationPipe
    // forbidNonWhitelisted -> 400) quando a build implantada não conhecia o campo,
    // e o erro era engolido -> o cadastro "sumia" sem aviso.
    const response = await api.post<{ company: Company }>("companies", data);
    // upsertById em vez de append: se o delta-sync já inseriu (POST lento), não duplica.
    set((state) => ({ companies: upsertById(state.companies, response.company) }));
    return response.company;
  },

  updateCompany: async (id, data) => {
    const response = await api.patch<{ company: Company }>(`companies/${id}`, data);
    set((state) => ({
      companies: state.companies.map((c) => (c.id === id ? response.company : c)),
    }));
    return response.company;
  },

  deleteCompany: async (id) => {
    const previous = get().companies;
    set((state) => ({ companies: state.companies.filter((c) => c.id !== id) }));
    try {
      await api.delete(`companies/${id}`);
    } catch (error) {
      set({ companies: previous });
      throw error;
    }
  },

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      // INC-01: uma única chamada agregada substitui a cascata de 6N+5 requests.
      // Anexos (dataUrl/base64) NÃO vêm aqui — são carregados sob demanda (INC-02).
      const data = await api.get<{
        projects: Project[];
        companies: Company[];
        modules: Module[];
        epics: Epic[];
        tasks: Parameters<typeof normalizeTask>[0][];
        comments?: Comment[];
        subtasks?: Subtask[];
        dependencies?: TaskDependency[];
        notes?: TaskNote[];
      }>("bootstrap");

      const normalizedProjects = asArray(data.projects).map(normalizeProject);

      set({
        projects: normalizedProjects,
        companies: asArray(data.companies),
        modules: asArray(data.modules),
        epics: asArray(data.epics).map(normalizeEpic),
        // Anexos ficam vazios até o detalhe ser aberto (fetch sob demanda).
        projectShowcaseAttachments: [],
        projectDemandAttachments: [],
        isLoading: false,
        hasLoaded: true,
      });

      // Tasks vão para a task-store, preservando edições otimistas em voo (dirty).
      const incomingTasks = asArray(data.tasks).map(normalizeTask);
      useTaskStore.setState((state) => ({
        tasks: replacePreservingDirty(state.tasks, incomingTasks, taskDirty.ids),
        moduleAttachments: [],
        // Coleções de tarefa vêm do backend (server-state), substituindo os mocks
        // locais. Anexos NÃO vêm aqui (base64 pesado) — carregam sob demanda.
        comments: asArray(data.comments),
        subtasks: asArray(data.subtasks),
        dependencies: asArray(data.dependencies),
        notes: asArray(data.notes),
        // O bootstrap traz as tasks junto: marca a task-store como carregada também.
        hasLoaded: true,
      }));
    } catch (error) {
      // Mesmo em erro, encerra o loading: a tela mostra vazio/erro, não fica presa.
      set({ isLoading: false, hasLoaded: true });
      throw error;
    }
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),
  getModulesByProject: (projectId) => get().modules.filter((m) => m.projectId === projectId),
  getEpicsByModule: (moduleId) => get().epics.filter((e) => e.moduleId === moduleId),
  getEpicsByProject: (projectId) => get().epics.filter((e) => e.projectId === projectId),
  getShowcaseAttachmentsByProject: (projectId) => get().projectShowcaseAttachments.filter((a) => a.projectId === projectId),

  fetchProjectShowcaseAttachments: async (projectId) => {
    const response = await api
      .get<{ attachments: ProjectShowcaseAttachment[] }>(`projects/${projectId}/showcase-attachments`)
      .catch(() => ({ attachments: [] as ProjectShowcaseAttachment[] }));
    set((state) => ({
      projectShowcaseAttachments: [
        ...state.projectShowcaseAttachments.filter((a) => a.projectId !== projectId),
        ...asArray(response.attachments),
      ],
    }));
    return asArray(response.attachments);
  },

  updateProjectShowcase: async (projectId, technicalDescription) => {
    const project = await api.put<Project>(`projects/${projectId}/showcase`, { technicalDescription });
    const normalized = normalizeProject(project);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? normalized : p)),
    }));
    return normalized;
  },

  addProjectShowcaseAttachment: async (projectId, data) => {
    const response = await api.post<{ attachment: ProjectShowcaseAttachment }>(`projects/${projectId}/showcase-attachments`, data);
    set((state) => ({
      projectShowcaseAttachments: [
        response.attachment,
        ...state.projectShowcaseAttachments.filter((a) => a.id !== response.attachment.id),
      ],
    }));
    return response.attachment;
  },

  deleteProjectShowcaseAttachment: async (id) => {
    const previous = get().projectShowcaseAttachments;
    set((state) => ({
      projectShowcaseAttachments: state.projectShowcaseAttachments.filter((a) => a.id !== id),
    }));
    try {
      await api.delete(`projects/showcase-attachments/${id}`);
    } catch {
      set({ projectShowcaseAttachments: previous });
      throw new Error("Erro ao excluir arquivo do projeto");
    }
  },

  getDemandAttachmentsByProject: (projectId) => get().projectDemandAttachments.filter((a) => a.projectId === projectId),

  fetchProjectDemandAttachments: async (projectId) => {
    const response = await api
      .get<{ attachments: ProjectDemandAttachment[] }>(`projects/${projectId}/demand-attachments`)
      .catch(() => ({ attachments: [] as ProjectDemandAttachment[] }));
    set((state) => ({
      projectDemandAttachments: [
        ...state.projectDemandAttachments.filter((a) => a.projectId !== projectId),
        ...asArray(response.attachments),
      ],
    }));
    return asArray(response.attachments);
  },

  updateProjectDemand: async (projectId, demandDescription) => {
    const project = await api.put<Project>(`projects/${projectId}/demand`, { demandDescription });
    const normalized = normalizeProject(project);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? normalized : p)),
    }));
    return normalized;
  },

  addProjectDemandAttachment: async (projectId, data) => {
    const response = await api.post<{ attachment: ProjectDemandAttachment }>(`projects/${projectId}/demand-attachments`, data);
    set((state) => ({
      projectDemandAttachments: [
        response.attachment,
        ...state.projectDemandAttachments.filter((a) => a.id !== response.attachment.id),
      ],
    }));
    return response.attachment;
  },

  deleteProjectDemandAttachment: async (id) => {
    const previous = get().projectDemandAttachments;
    set((state) => ({
      projectDemandAttachments: state.projectDemandAttachments.filter((a) => a.id !== id),
    }));
    try {
      await api.delete(`projects/demand-attachments/${id}`);
    } catch {
      set({ projectDemandAttachments: previous });
      throw new Error("Erro ao excluir arquivo da demanda");
    }
  },

  createProject: async (data) => {
    const project = await api.post<Project>("projects", data);
    const normalized = normalizeProject(project);
    // upsertById em vez de append: se o delta-sync já inseriu (POST lento), não duplica.
    set((state) => ({ projects: upsertById(state.projects, normalized) }));
    return normalized;
  },

  updateProject: async (id, data) => {
    projectDirty.markDirty(id);
    try {
      const project = await api.put<Project>(`projects/${id}`, data);
      const normalized = normalizeProject(project);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? normalized : p)),
      }));
      return normalized;
    } finally {
      projectDirty.clearDirty(id);
    }
  },

  deleteProject: async (id) => {
    await api.delete(`projects/${id}`);
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
  },

  createModule: async (data) => {
    const response = await api.post<{
      module: Module;
      epic?: Epic;
      task?: Task;
      timeLog?: TimeLog;
      attachments?: ModuleAttachment[];
    }>("modules", data);
    const { module: projectModule, epic, task, timeLog, attachments } = response;

    set((state) => ({ modules: upsertById(state.modules, projectModule) }));

    if (epic) {
      set((state) => ({ epics: upsertById(state.epics, normalizeEpic(epic)) }));
    }

    useTaskStore.setState((state) => {
      const next = { ...state };
      if (task) {
        next.tasks = [...state.tasks.filter((t) => t.id !== task.id), {
          ...task,
          dependencyIds: task.dependencyIds ?? [],
          tags: task.tags ?? [],
        }];
      }
      if (timeLog) {
        const normalizedLog = { ...timeLog, date: timeLog.date.split("T")[0] };
        next.timeLogs = [...state.timeLogs.filter((tl) => tl.id !== normalizedLog.id), normalizedLog];
      }
      if (attachments?.length) {
        const ids = new Set(attachments.map((a) => a.id));
        next.moduleAttachments = [
          ...state.moduleAttachments.filter((a) => !ids.has(a.id)),
          ...attachments,
        ];
      }
      return next;
    });

    return projectModule;
  },

  deleteModule: async (id) => {
    const previous = {
      modules: get().modules,
      epics: get().epics,
    };
    const taskSnapshot = useTaskStore.getState();

    set((state) => ({
      modules: state.modules.filter((m) => m.id !== id),
      epics: state.epics.filter((e) => e.moduleId !== id),
    }));
    useTaskStore.setState((state) => ({
      tasks: state.tasks.filter((t) => t.moduleId !== id),
      moduleAttachments: state.moduleAttachments.filter((a) => a.moduleId !== id),
    }));

    try {
      await api.delete(`modules/${id}`);
    } catch {
      set(previous);
      useTaskStore.setState({
        tasks: taskSnapshot.tasks,
        moduleAttachments: taskSnapshot.moduleAttachments,
      });
      throw new Error("Erro ao excluir módulo");
    }
  },

  createModulesBulk: async (projectId, modulesData) => {
    const created = await Promise.all(
      modulesData.map(async (m, i) => {
        const response = await api.post<{ module: Module }>("modules", {
          projectId,
          name: m.name,
          description: m.description,
          order: i,
        });
        return response.module;
      })
    );
    set((state) => ({ modules: created.reduce((acc, m) => upsertById(acc, m), state.modules) }));
    return created;
  },

  updateModule: async (id, data) => {
    const response = await api.patch<{ module: Module }>(`modules/${id}`, data);
    const updated = response.module;
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? updated : m)),
    }));
    return updated;
  },

  createEpic: async (data) => {
    const response = await api.post<{ epic: Epic }>("epics", data);
    const epic = response.epic;
    const normalized = normalizeEpic(epic);
    set((state) => ({ epics: [...state.epics, normalized] }));
    return normalized;
  },

  updateEpic: async (id, data) => {
    // Persiste no backend. Envia só os campos aceitos pelo UpdateEpicDto
    // (forbidNonWhitelisted derruba qualquer campo extra com 400).
    const response = await api.patch<{ epic: Epic }>(`epics/${id}`, {
      moduleId: data.moduleId,
      name: data.name,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      progress: data.progress,
      developerIds: data.developerIds,
    });
    const normalized = normalizeEpic(response.epic);
    set((state) => ({
      epics: state.epics.map((e) => (e.id === id ? normalized : e)),
    }));
    return normalized;
  },

  setSelectedProject: (id) => set({ selectedProjectId: id }),

  addDeveloperToProject: (projectId, userId) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId && !p.developerIds.includes(userId)
          ? { ...p, developerIds: [...p.developerIds, userId], updatedAt: new Date().toISOString() }
          : p
      ),
    }));
    void api.post(`projects/${projectId}/developers/${userId}`, {}).catch(() => {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, developerIds: p.developerIds.filter((id) => id !== userId) }
            : p
        ),
      }));
      toast.error("Não foi possível adicionar o membro ao projeto.");
    });
  },

  removeDeveloperFromProject: (projectId, userId) => {
    const previous = get().projects;
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, developerIds: p.developerIds.filter((id) => id !== userId), updatedAt: new Date().toISOString() }
          : p
      ),
    }));
    void api.delete(`projects/${projectId}/developers/${userId}`).catch(() => {
      set({ projects: previous });
      toast.error("Não foi possível remover o membro do projeto.");
    });
  },

  getQueuedProjects: () => {
    return get()
      .projects.filter(
        (p) => p.status !== "CONCLUIDO" && p.status !== "CANCELADO" && p.queueOrder != null
      )
      .sort((a, b) => (a.queueOrder ?? 0) - (b.queueOrder ?? 0));
  },

  reorderQueue: (orderedIds) => {
    set((state) => ({
      projects: state.projects.map((p) => {
        const pos = orderedIds.indexOf(p.id);
        if (pos === -1) return p;
        return { ...p, queueOrder: pos + 1, updatedAt: new Date().toISOString() };
      }),
    }));
    void api.post("projects/queue/reorder", { orderedIds }).catch(() => {
      // mantém atualização otimista local; tela pode recarregar da API depois
      toast.error("Não foi possível salvar a ordem da fila.");
    });
  },
}));
