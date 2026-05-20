"use client";

import { create } from "zustand";
import type { Project, Module, Epic } from "@/types";
import { mockProjects, mockModules, mockEpics } from "@/mocks";
import { generateId, delay } from "@/lib/utils";

interface ProjectStore {
  projects: Project[];
  modules: Module[];
  epics: Epic[];
  selectedProjectId: string | null;
  isLoading: boolean;

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
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [...mockProjects],
  modules: [...mockModules],
  epics: [...mockEpics],
  selectedProjectId: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    await delay(400);
    set({ projects: [...mockProjects], modules: [...mockModules], epics: [...mockEpics], isLoading: false });
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),
  getModulesByProject: (projectId) => get().modules.filter((m) => m.projectId === projectId),
  getEpicsByModule: (moduleId) => get().epics.filter((e) => e.moduleId === moduleId),
  getEpicsByProject: (projectId) => get().epics.filter((e) => e.projectId === projectId),

  createProject: async (data) => {
    await delay(600);
    const now = new Date().toISOString();
    const project: Project = { ...data, id: generateId("proj"), createdAt: now, updatedAt: now };
    set((state) => ({ projects: [...state.projects, project] }));
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
    const module: Module = { ...data, id: generateId("mod"), createdAt: now, updatedAt: now };
    set((state) => ({ modules: [...state.modules, module] }));
    return module;
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
}));
