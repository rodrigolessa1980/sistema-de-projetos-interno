"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthSession, LoginCredentials, RegisterCredentials, UserPermission } from "@/types";
import { login as apiLogin, logout as apiLogout, register as apiRegister, getStoredSession } from "@/lib/auth";
import { api } from "@/lib/api";
import { useUserStore } from "@/stores/ui-store";
import { useWorkSessionStore } from "@/stores/work-session-store";

function syncUserToStore(user: User) {
  const now = new Date().toISOString();
  useUserStore.getState().upsertUser({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    position: user.position ?? "",
    department: user.department ?? "",
    projectIds: user.projectIds ?? [],
    permissions: user.permissions ?? [],
    createdAt: user.createdAt ?? now,
    updatedAt: user.updatedAt ?? now,
  });
}

interface AuthStore {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  initSession: () => Promise<void>;
  clearError: () => void;
  get user(): User | null;
  get isAuthenticated(): boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      isLoading: true,
      error: null,

      get user() {
        return get().session?.user ?? null;
      },

      get isAuthenticated() {
        const session = get().session;
        if (!session) return false;
        return new Date(session.expiresAt) > new Date();
      },

      initSession: async () => {
        const session = getStoredSession();
        if (session) {
          set({ session, isLoading: false });
          try {
            const [meData, permsData] = await Promise.all([
              api.get<{ user: User }>("auth/me"),
              api.get<UserPermission[]>(`users/${session.user.id}/permissions`).catch(() => [] as UserPermission[]),
            ]);
            const userWithPerms: User = { ...meData.user, permissions: permsData };
            const updatedSession = { ...session, user: userWithPerms };
            if (typeof window !== "undefined") {
              localStorage.setItem("devflow_session", JSON.stringify(updatedSession));
            }
            set({ session: updatedSession });
            syncUserToStore(userWithPerms);
          } catch (err) {
            console.error("Falha ao sincronizar sessão:", err);
            const message = err instanceof Error ? err.message : "";
            if (message.includes("401") || message.toLowerCase().includes("unauthorized")) {
              get().logout();
            } else {
              set({ isLoading: false });
            }
          }
        } else {
          set({ session: null, isLoading: false });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await apiLogin(credentials);
          set({ session, isLoading: false });
          syncUserToStore(session.user);
          void useWorkSessionStore.getState().syncFromServer();
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Erro ao fazer login",
            isLoading: false,
          });
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await apiRegister(credentials);
          set({ session, isLoading: false });
          syncUserToStore(session.user);
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Erro ao cadastrar conta",
            isLoading: false,
          });
        }
      },

      logout: () => {
        apiLogout();
        useWorkSessionStore.getState().clearSession();
        set({ session: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "devflow-auth-v2",
      partialize: (state) => ({ session: state.session }),
    }
  )
);
