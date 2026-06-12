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

const DEFAULT_SIDEBAR_GROUPS = ["Principal", "Projetos", "Trabalho", "Análise", "Relatórios", "Admin"];

interface UIStore {
  sidebarCollapsed: boolean;
  sidebarExpandedGroups: string[];
  notifications: Notification[];
  unreadCount: number;
  searchQuery: string;
  isSearchOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
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
      notifications: [],
      unreadCount: 0,
      searchQuery: "",
      isSearchOpen: false,

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
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
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarExpandedGroups: state.sidebarExpandedGroups,
      }),
    }
  )
);

interface UserStore {
  users: User[];
  getUserById: (id: string) => User | undefined;
  fetchUsers: () => Promise<void>;
  createUser: (data: Omit<User, "id" | "createdAt" | "updatedAt">) => User;
  upsertUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateUserPermissions: (userId: string, permissions: UserPermission[]) => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      getUserById: (id) => get().users.find((user) => user.id === id),

      fetchUsers: async () => {
        const response = await api.get<(User & { permissions: UserPermission[]; permissionCount: number })[]>("users");
        set((state) => ({
          users: asArray(response).map((u) => ({
            ...state.users.find((existing) => existing.id === u.id),
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: u.avatar ?? undefined,
            position: u.position ?? "",
            department: u.department ?? "",
            projectIds: u.projectIds ?? [],
            permissions: u.permissions ?? [],
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          })),
        }));
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

      updateUser: (id, data) => {
        const now = new Date().toISOString();
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...data, updatedAt: now } : user
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
    }),
    {
      name: "devflow-users-v3",
      partialize: (state) => ({ users: state.users }),
    }
  )
);
