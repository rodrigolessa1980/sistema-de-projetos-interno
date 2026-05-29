"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthSession, LoginCredentials, RegisterCredentials } from "@/types";
import { login as apiLogin, logout as apiLogout, register as apiRegister, getStoredSession } from "@/lib/auth";
import { api } from "@/lib/api";

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
          // Sincroniza os dados do usuário em segundo plano
          try {
            const data = await api.get<{ user: User }>("auth/me");
            const updatedSession = { ...session, user: data.user };
            if (typeof window !== "undefined") {
              localStorage.setItem("devflow_session", JSON.stringify(updatedSession));
            }
            set({ session: updatedSession });
          } catch (err) {
            console.error("Falha ao sincronizar sessão:", err);
            // Se o token falhar (ex: expirado no backend), limpa a sessão
            get().logout();
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
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Erro ao cadastrar conta",
            isLoading: false,
          });
        }
      },

      logout: () => {
        apiLogout();
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
