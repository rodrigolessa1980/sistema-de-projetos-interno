"use client";

import { useAuthStore } from "@/stores";
import { hasPermission } from "@/lib/auth";
import { useEffect } from "react";

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    store.initSession();
  }, []);

  return {
    user: store.session?.user ?? null,
    session: store.session,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: store.session ? new Date(store.session.expiresAt) > new Date() : false,
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
    can: (permission: string) => hasPermission(store.session?.user ?? null, permission),
    isAdmin: store.session?.user?.role === "ADMIN",
    isDeveloper: store.session?.user?.role === "DEVELOPER",
  };
}
