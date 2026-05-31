import type { User, AuthSession, LoginCredentials, RegisterCredentials } from "@/types";
import { api } from "./api";

const SESSION_KEY = "devflow_session";

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const session = await api.post<AuthSession>("auth/login", credentials);

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export async function register(credentials: RegisterCredentials): Promise<AuthSession> {
  const session = await api.post<AuthSession>("auth/register", credentials);

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session: AuthSession = JSON.parse(stored);
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  const adminPermissions = [
    "projects:create", "projects:read", "projects:update", "projects:delete",
    "modules:create", "modules:read", "modules:update", "modules:delete",
    "epics:create", "epics:read", "epics:update", "epics:delete",
    "tasks:create", "tasks:read", "tasks:update", "tasks:delete",
    "users:read", "users:create", "users:update", "users:delete",
    "metrics:read", "audit:read",
  ];
  const developerPermissions = [
    "projects:read", "modules:read", "epics:read",
    "tasks:read", "tasks:update",
    "timelogs:create", "timelogs:read",
    "comments:create", "comments:read",
  ];

  if (user.role === "ADMIN") return adminPermissions.includes(permission);
  return developerPermissions.includes(permission);
}
