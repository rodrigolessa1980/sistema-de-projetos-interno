"use client";

import { create } from "zustand";
import type { Project, Module, Epic, Company } from "@/types";
import type { Task, TimeLog, ModuleAttachment } from "@/types";
// Module and Epic are fetched from API; types re-exported for clarity
import { generateId, delay } from "@/lib/utils";
import { api } from "@/lib/api";
import { useTaskStore } from "./task-store";

interface ProjectStore {
  projects: Project[];
  modules: Module[];
  epics: Epic[];
  companies: Company[];
  selectedProjectId: string | null;
  isLoading: boolean;

  getCompanyById: (id: string) => Company | undefined;
  createCompany: (data: Omit<Company, "id" | "createdAt" | "updatedAt">) => Company;
  updateCompany: (id: string, data: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getModulesByProject: (projectId: string) => Module[];
  getEpicsByModule: (moduleId: string) => Epic[];
  getEpicsByProject: (projectId: string) => Epic[];
  createProject: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  createModule: (data: {
    projectId: string;
    name: string;
    description: string;
    order?: number;
    hours?: number;
    workDate?: string;
    attachments?: { name: string; type: string; size: number; dataUrl: string }[];
  }) => Promise<Module>;
  updateModule: (id: string, data: Partial<Module>) => Promise<Module>;
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
  selectedProjectId: null,
  isLoading: false,

  getCompanyById: (id) => get().companies.find((c) => c.id === id),

  createCompany: (data) => {
    const now = new Date().toISOString();
    const company: Company = { ...data, id: generateId("company"), createdAt: now, updatedAt: now };
    void api.post<{ company: Company }>("companies", data).then((response) => {
      set((state) => ({
        companies: state.companies.map((item) => (item.id === company.id ? response.company : item)),
      }));
    }).catch(() => {
      set((state) => ({ companies: state.companies.filter((item) => item.id !== company.id) }));
    });
    set((state) => ({ companies: [...state.companies, company] }));
    return company;
  },

  updateCompany: (id, data) => {
    const now = new Date().toISOString();
    set((state) => ({
      companies: state.companies.map((c) => c.id === id ? { ...c, ...data, updatedAt: now } : c),
    }));
    void api.patch<{ company: Company }>(`companies/${id}`, data).then((response) => {
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? response.company : c)),
      }));
    }).catch(() => {
      // mantém atualização local otimista
    });
  },

  deleteCompany: (id) => {
    const previous = get().companies;
    set((state) => ({ companies: state.companies.filter((c) => c.id !== id) }));
    void api.delete(`companies/${id}`).catch(() => {
      set({ companies: previous });
    });
  },

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const [projects, companiesResponse] = await Promise.all([
        api.get<Project[]>("projects"),
        api.get<{ companies: Company[] }>("companies"),
      ]);
      const normalizedProjects = projects.map((project) => ({
        ...project,
        endDate: project.endDate ?? undefined,
        queueOrder: project.queueOrder ?? undefined,
        avatar: project.avatar ?? undefined,
        testUrl: project.testUrl ?? undefined,
        developerIds: project.developerIds ?? [],
      }));

      // Busca módulos e epics de todos os projetos em paralelo
      const projectIds = normalizedProjects.map((p) => p.id);
      const [modulesResults, epicsResults, attachmentsResults] = await Promise.all([
        Promise.all(projectIds.map((id) =>
          api.get<{ modules: Module[] }>(`projects/${id}/modules`).then((r) => r.modules).catch(() => [] as Module[])
        )),
        Promise.all(projectIds.map((id) =>
          api.get<{ epics: Epic[] }>(`projects/${id}/epics`).then((r) => r.epics).catch(() => [] as Epic[])
        )),
        Promise.all(projectIds.map((id) =>
          api.get<{ attachments: ModuleAttachment[] }>(`projects/${id}/module-attachments`).then((r) => r.attachments).catch(() => [] as ModuleAttachment[])
        )),
      ]);

      set({
        projects: normalizedProjects,
        companies: companiesResponse.companies,
        modules: modulesResults.flat(),
        epics: epicsResults.flat(),
        isLoading: false,
      });
      useTaskStore.setState({ moduleAttachments: attachmentsResults.flat() });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),
  getModulesByProject: (projectId) => get().modules.filter((m) => m.projectId === projectId),
  getEpicsByModule: (moduleId) => get().epics.filter((e) => e.moduleId === moduleId),
  getEpicsByProject: (projectId) => get().epics.filter((e) => e.projectId === projectId),

  createProject: async (data) => {
    const project = await api.post<Project>("projects", data);
    const normalized: Project = {
      ...project,
      endDate: project.endDate ?? undefined,
      queueOrder: project.queueOrder ?? undefined,
      avatar: project.avatar ?? undefined,
      testUrl: project.testUrl ?? undefined,
      developerIds: project.developerIds ?? [],
    };
    set((state) => ({ projects: [...state.projects, normalized] }));
    return normalized;
  },

  updateProject: async (id, data) => {
    const project = await api.put<Project>(`projects/${id}`, data);
    const normalized: Project = {
      ...project,
      endDate: project.endDate ?? undefined,
      queueOrder: project.queueOrder ?? undefined,
      avatar: project.avatar ?? undefined,
      testUrl: project.testUrl ?? undefined,
      developerIds: project.developerIds ?? [],
    };
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? normalized : p)),
    }));
    return normalized;
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

    set((state) => ({ modules: [...state.modules, projectModule] }));

    if (epic) {
      set((state) => ({ epics: [...state.epics, epic] }));
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
    set((state) => ({ modules: [...state.modules, ...created] }));
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
    set((state) => ({ epics: [...state.epics, epic] }));
    return epic;
  },

  updateEpic: async (id, data) => {
    await delay(300);
    const now = new Date().toISOString();
    let updated!: Epic;
    set((state) => ({
      epics: state.epics.map((e) => {
        if (e.id === id) { updated = { ...e, ...data, updatedAt: now }; return updated; }
        return e;
      }),
    }));
    return updated;
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
    });
  },
}));
