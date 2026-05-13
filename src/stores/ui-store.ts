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

export const useUserStore = create<{
  users: import("@/types").User[];
  getUserById: (id: string) => import("@/types").User | undefined;
}>((set, get) => {
  const { mockUsers } = require("@/mocks/users");
  return {
    users: [...mockUsers],
    getUserById: (id) => get().users.find((u) => u.id === id),
  };
});
