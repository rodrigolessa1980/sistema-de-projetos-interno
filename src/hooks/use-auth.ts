"use client";

import { useAuthStore, useUserStore } from "@/stores";
import { hasPermission } from "@/lib/auth";
import { useEffect } from "react";

export function useAuth() {
  const store = useAuthStore();
  const getUserById = useUserStore((s) => s.getUserById);

  useEffect(() => {
    store.initSession();
  }, []);

  const sessionUser = store.session?.user ?? null;
  // Prefer the user from the store because it carries the loaded permissions array
  const user = sessionUser ? (getUserById(sessionUser.id) ?? sessionUser) : null;

  return {
    user,
    session: store.session,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: store.session ? new Date(store.session.expiresAt) > new Date() : false,
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
    can: (permission: string) => hasPermission(user, permission),
    isAdmin: user?.role === "ADMIN",
    isDeveloper: user?.role === "DEVELOPER",
  };
}
