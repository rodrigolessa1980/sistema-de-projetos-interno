"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthSession } from "@/types";
import { fakeLogin, fakeLogout, getStoredSession } from "@/lib/auth";
import type { LoginCredentials } from "@/types";

interface AuthStore {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  initSession: () => void;
  clearError: () => void;
  get user(): User | null;
  get isAuthenticated(): boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      isLoading: false,
      error: null,

      get user() {
        return get().session?.user ?? null;
      },

      get isAuthenticated() {
        const session = get().session;
        if (!session) return false;
        return new Date(session.expiresAt) > new Date();
      },

      initSession: () => {
        const session = getStoredSession();
        set({ session });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await fakeLogin(credentials);
          set({ session, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Erro ao fazer login",
            isLoading: false,
          });
        }
      },

      logout: () => {
        fakeLogout();
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
