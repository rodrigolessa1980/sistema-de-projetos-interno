"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification, User, UserPermission } from "@/types";
import { api } from "@/lib/api";

const asArray = <T,>(value: T[] | null | undefined): T[] => Array.isArray(value) ? value : [];

const normalizeUser = (user: User): User => ({
  ...user,
  projectIds: asArray(user.projectIds),
  permissions: asArray(user.permissions),
});

const DEFAULT_SIDEBAR_GROUPS = ["Principal", "Projetos", "Trabalho", "Tempo & Horas", "Relatórios", "Administração"];

interface UIStore {
  sidebarCollapsed: boolean;
  sidebarExpandedGroups: string[];
  /** Drawer da sidebar no mobile (não persiste; começa fechado a cada sessão). */
  sidebarMobileOpen: boolean;
  notifications: Notification[];
  unreadCount: number;
  searchQuery: string;
  isSearchOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  toggleSidebarGroup: (group: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: (userId?: string) => void;
  addNotification: (notif: Omit<Notification, "id" | "createdAt">) => void;
  fetchNotifications: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarExpandedGroups: DEFAULT_SIDEBAR_GROUPS,
      sidebarMobileOpen: false,
      notifications: [],
      unreadCount: 0,
      searchQuery: "",
      isSearchOpen: false,

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
      toggleSidebarGroup: (group) =>
        set((state) => ({
          sidebarExpandedGroups: state.sidebarExpandedGroups.includes(group)
            ? state.sidebarExpandedGroups.filter((g) => g !== group)
            : [...state.sidebarExpandedGroups, group],
        })),

      markNotificationRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          void api.patch(`notifications/${id}/read`, {}).catch(() => {});
          return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
        }),

      markAllRead: (userId) =>
        set((state) => {
          void api.patch("notifications/read-all", {}).catch(() => {});
          return {
            notifications: state.notifications.map((n) =>
              !userId || n.userId === userId ? { ...n, read: true } : n
            ),
            unreadCount: state.notifications.filter((n) => !n.read && (!userId || n.userId !== userId)).length,
          };
        }),

      addNotification: (notif) => {
        const now = new Date().toISOString();
        const full: Notification = {
          ...notif,
          id: `notif-${Date.now()}`,
          createdAt: now,
        };
        set((state) => ({
          notifications: [full, ...state.notifications],
          unreadCount: state.unreadCount + (notif.read ? 0 : 1),
        }));
      },

      fetchNotifications: async () => {
        const notifications = await api.get<Notification[]>("notifications");
        const normalized = asArray(notifications);
        set({
          notifications: normalized,
          unreadCount: normalized.filter((notification) => !notification.read).length,
        });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: "devflow-ui",
      version: 1,
      // v1: os grupos da sidebar foram reorganizados/renomeados. Reexpande com os
      // novos nomes para não deixar seções novas colapsadas em quem já usava o app.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as { sidebarCollapsed?: boolean; sidebarExpandedGroups?: string[] };
        return {
          sidebarCollapsed: state.sidebarCollapsed ?? false,
          // Antes da v1 os grupos tinham outros nomes; reexpande com os novos.
          sidebarExpandedGroups:
            version < 1 ? DEFAULT_SIDEBAR_GROUPS : state.sidebarExpandedGroups ?? DEFAULT_SIDEBAR_GROUPS,
        };
      },
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarExpandedGroups: state.sidebarExpandedGroups,
      }),
    }
  )
);

interface CreateUserRemoteInput {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  role: User["role"];
}

interface UserStore {
  users: User[];
  /** True após a 1ª carga de usuários (gate anti "falso vazio"). */
  hasLoaded: boolean;
  getUserById: (id: string) => User | undefined;
  fetchUsers: () => Promise<void>;
  createUser: (data: Omit<User, "id" | "createdAt" | "updatedAt">) => User;
  /** Cria o usuário DE VERDADE no backend (papel respeitado, já aprovado). */
  createUserRemote: (data: CreateUserRemoteInput) => Promise<User>;
  upsertUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  /** Atalho direto para promover/rebaixar admin (persiste no backend). */
  setUserRole: (id: string, role: User["role"]) => Promise<void>;
  deleteUser: (id: string) => void;
  updateUserPermissions: (userId: string, permissions: UserPermission[]) => Promise<void>;
  approveUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      hasLoaded: false,
      getUserById: (id) => get().users.find((user) => user.id === id),

      fetchUsers: async () => {
        try {
          const response = await api.get<(User & { permissions: UserPermission[]; permissionCount: number })[]>("users");
          set((state) => ({
            users: asArray(response).map((u) => ({
            ...state.users.find((existing) => existing.id === u.id),
            id: u.id,
            tenantId: u.tenantId,
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: u.avatar ?? undefined,
            position: u.position ?? "",
            department: u.department ?? "",
            isApproved: u.isApproved,
            projectIds: u.projectIds ?? [],
            permissions: u.permissions ?? [],
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          })),
          }));
        } finally {
          // Mesmo em erro, encerra o loading (evita tela presa em "carregando").
          set({ hasLoaded: true });
        }
      },

      createUser: (data) => {
        const now = new Date().toISOString();
        const user: User = {
          ...data,
          id: `user-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ users: [...state.users, user] }));
        return user;
      },

      createUserRemote: async (data) => {
        const u = await api.post<{
          id: string;
          tenantId: string;
          name: string;
          email: string;
          role: User["role"];
          avatar: string | null;
          position: string;
          department: string;
          isApproved: boolean;
          createdAt: string;
          updatedAt: string;
        }>("users", data);
        const created: User = {
          id: u.id,
          tenantId: u.tenantId,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar ?? undefined,
          position: u.position,
          department: u.department,
          isApproved: u.isApproved,
          projectIds: [],
          permissions: [],
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        };
        set((state) => ({ users: [...state.users, created] }));
        return created;
      },

      upsertUser: (user) => {
        const normalized = normalizeUser(user);
        set((state) => {
          const exists = state.users.some((u) => u.id === normalized.id || u.email === normalized.email);
          if (exists) {
            return {
              users: state.users.map((u) =>
                u.id === normalized.id || u.email === normalized.email ? { ...u, ...normalized } : u
              ),
            };
          }
          return { users: [...state.users, normalized] };
        });
      },

      updateUser: async (id, data) => {
        // Persiste no backend os campos editáveis por admin; ignora contas
        // locais (sem id do servidor) que ainda não foram para o banco.
        const isRemote = !id.startsWith("user-");
        if (isRemote) {
          await api.put(`users/${id}`, {
            name: data.name,
            position: data.position,
            department: data.department,
            role: data.role,
          });
        }
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...data, updatedAt: now } : user
          ),
        }));
      },

      setUserRole: async (id, role) => {
        await api.put(`users/${id}`, { role });
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, role, updatedAt: now } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },

      updateUserPermissions: async (userId, permissions) => {
        await api.put(`users/${userId}/permissions`, { permissions });
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, permissions } : u
          ),
        }));
      },

      approveUser: async (id) => {
        await api.post(`users/${id}/approve`, {});
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, isApproved: true } : u
          ),
        }));
      },
    }),
    {
      name: "devflow-users-v3",
      partialize: (state) => ({ users: state.users }),
    }
  )
);
