"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "@/types";
import { mockNotifications } from "@/mocks";

interface UIStore {
  sidebarCollapsed: boolean;
  notifications: Notification[];
  unreadCount: number;
  searchQuery: string;
  isSearchOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notif: Omit<Notification, "id" | "createdAt">) => void;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      notifications: [...mockNotifications],
      unreadCount: mockNotifications.filter((n) => !n.read).length,
      searchQuery: "",
      isSearchOpen: false,

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      markNotificationRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
        }),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

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

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: "devflow-ui",
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);

interface UserStore {
  users: import("@/types").User[];
  getUserById: (id: string) => import("@/types").User | undefined;
  createUser: (data: Omit<import("@/types").User, "id" | "createdAt" | "updatedAt">) => import("@/types").User;
  updateUser: (id: string, data: Partial<import("@/types").User>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserStore>()(
  (persist as any)(
    (set: any, get: any) => {
      const { mockUsers } = require("@/mocks/users");
      return {
        users: [...mockUsers],
        getUserById: (id: string) => get().users.find((u: import("@/types").User) => u.id === id),

        createUser: (data: Omit<import("@/types").User, "id" | "createdAt" | "updatedAt">) => {
          const now = new Date().toISOString();
          const user: import("@/types").User = {
            ...data,
            id: `user-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
          };
          set((state: UserStore) => ({ users: [...state.users, user] }));
          return user;
        },

        updateUser: (id: string, data: Partial<import("@/types").User>) => {
          const now = new Date().toISOString();
          set((state: UserStore) => ({
            users: state.users.map((u) =>
              u.id === id ? { ...u, ...data, updatedAt: now } : u
            ),
          }));
        },

        deleteUser: (id: string) => {
          set((state: UserStore) => ({
            users: state.users.filter((u) => u.id !== id),
          }));
        },
      };
    },
    {
      name: "devflow-users",
      partialize: (state: UserStore) => ({ users: state.users }),
    }
  )
);
