"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification, User } from "@/types";

interface UIStore {
  sidebarCollapsed: boolean;
  notifications: Notification[];
  unreadCount: number;
  searchQuery: string;
  isSearchOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: (userId?: string) => void;
  addNotification: (notif: Omit<Notification, "id" | "createdAt">) => void;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      notifications: [],
      unreadCount: 0,
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

      markAllRead: (userId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            !userId || n.userId === userId ? { ...n, read: true } : n
          ),
          unreadCount: state.notifications.filter((n) => !n.read && (!userId || n.userId !== userId)).length,
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
  users: User[];
  getUserById: (id: string) => User | undefined;
  createUser: (data: Omit<User, "id" | "createdAt" | "updatedAt">) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      getUserById: (id) => get().users.find((user) => user.id === id),

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
    }),
    {
      name: "devflow-users-v3",
      partialize: (state) => ({ users: state.users }),
    }
  )
);
