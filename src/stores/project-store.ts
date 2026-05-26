"use client";

import { create } from "zustand";
import type { Project, Module, Epic, Company } from "@/types";
import { mockProjects, mockModules, mockEpics, mockCompanies } from "@/mocks";
import { generateId, delay } from "@/lib/utils";

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
  createModule: (data: Omit<Module, "id" | "createdAt" | "updatedAt">) => Promise<Module>;
  updateModule: (id: string, data: Partial<Module>) => Promise<Module>;
  deleteModule: (id: string) => void;
  createModulesBulk: (projectId: string, modules: { name: string; description: string }[]) => Promise<Module[]>;
  createEpic: (data: Omit<Epic, "id" | "createdAt" | "updatedAt">) => Promise<Epic>;
  updateEpic: (id: string, data: Partial<Epic>) => Promise<Epic>;
  setSelectedProject: (id: string | null) => void;
  addDeveloperToProject: (projectId: string, userId: string) => void;
  removeDeveloperFromProject: (projectId: string, userId: string) => void;

  // Fila de desenvolvimento
  getQueuedProjects: () => Project[];
  reorderQueue: (orderedIds: string[]) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [...mockProjects],
  modules: [...mockModules],
  epics: [...mockEpics],
  companies: [...mockCompanies],
  selectedProjectId: null,
  isLoading: false,

  getCompanyById: (id) => get().companies.find((c) => c.id === id),

  createCompany: (data) => {
    const now = new Date().toISOString();
    const company: Company = { ...data, id: generateId("company"), createdAt: now, updatedAt: now };
    set((state) => ({ companies: [...state.companies, company] }));
    return company;
  },

  updateCompany: (id, data) => {
    const now = new Date().toISOString();
    set((state) => ({
      companies: state.companies.map((c) => c.id === id ? { ...c, ...data, updatedAt: now } : c),
    }));
  },

  deleteCompany: (id) => {
    set((state) => ({ companies: state.companies.filter((c) => c.id !== id) }));
  },

  fetchProjects: async () => {
    set({ isLoading: true });
    await delay(400);
    set({ projects: [...mockProjects], modules: [...mockModules], epics: [...mockEpics], companies: [...mockCompanies], isLoading: false });
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),
  getModulesByProject: (projectId) => get().modules.filter((m) => m.projectId === projectId),
  getEpicsByModule: (moduleId) => get().epics.filter((e) => e.moduleId === moduleId),
  getEpicsByProject: (projectId) => get().epics.filter((e) => e.projectId === projectId),

  createProject: async (data) => {
    await delay(600);
    const now = new Date().toISOString();

    // Calcula posição na fila pela data de entrega (endDate)
    const state = get();
    const queued = state.projects
      .filter((p) => p.status !== "CONCLUIDO" && p.status !== "CANCELADO" && p.queueOrder != null)
      .sort((a, b) => (a.queueOrder ?? 0) - (b.queueOrder ?? 0));

    let insertAt: number;
    if (!data.endDate) {
      insertAt = queued.length + 1;
    } else {
      const idx = queued.findIndex((p) => p.endDate && p.endDate > data.endDate!);
      insertAt = idx === -1 ? queued.length + 1 : (queued[idx].queueOrder ?? idx + 1);
    }

    // Empurra para baixo quem está na posição >= insertAt
    const shifted = state.projects.map((p) =>
      p.queueOrder != null && p.queueOrder >= insertAt
        ? { ...p, queueOrder: p.queueOrder + 1 }
        : p
    );

    const project: Project = { ...data, id: generateId("proj"), queueOrder: insertAt, createdAt: now, updatedAt: now };
    set({ projects: [...shifted, project] });
    return project;
  },

  updateProject: async (id, data) => {
    await delay(400);
    const now = new Date().toISOString();
    let updated!: Project;
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id === id) { updated = { ...p, ...data, updatedAt: now }; return updated; }
        return p;
      }),
    }));
    return updated;
  },

  deleteProject: async (id) => {
    await delay(400);
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
  },

  createModule: async (data) => {
    await delay(200);
    const now = new Date().toISOString();
    const projectModule: Module = { ...data, id: generateId("mod"), createdAt: now, updatedAt: now };
    set((state) => ({ modules: [...state.modules, projectModule] }));
    return projectModule;
  },

  deleteModule: (id) => {
    set((state) => ({ modules: state.modules.filter((m) => m.id !== id) }));
  },

  createModulesBulk: async (projectId, modulesData) => {
    const now = new Date().toISOString();
    const created: Module[] = modulesData.map((m, i) => ({
      id: generateId("mod"),
      projectId,
      name: m.name,
      description: m.description,
      order: i,
      progress: 0,
      createdAt: now,
      updatedAt: now,
    }));
    set((state) => ({ modules: [...state.modules, ...created] }));
    return created;
  },

  updateModule: async (id, data) => {
    await delay(300);
    const now = new Date().toISOString();
    let updated!: Module;
    set((state) => ({
      modules: state.modules.map((m) => {
        if (m.id === id) { updated = { ...m, ...data, updatedAt: now }; return updated; }
        return m;
      }),
    }));
    return updated;
  },

  createEpic: async (data) => {
    await delay(400);
    const now = new Date().toISOString();
    const epic: Epic = { ...data, id: generateId("epic"), createdAt: now, updatedAt: now };
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
  },

  removeDeveloperFromProject: (projectId, userId) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, developerIds: p.developerIds.filter((id) => id !== userId), updatedAt: new Date().toISOString() }
          : p
      ),
    }));
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
  },
}));
