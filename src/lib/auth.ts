import type { User, AuthSession, LoginCredentials, RegisterCredentials, TenantOption } from "@/types";
import { api } from "./api";

const SESSION_KEY = "devflow_session";

/** Lista pública dos grupos (tenants) disponíveis para o cadastro. */
export async function listTenants(): Promise<TenantOption[]> {
  return api.get<TenantOption[]>("auth/tenants");
}

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

  // Admins have full access
  if (user.role === "ADMIN") return true;

  // If user has stored permissions from the DB, use them
  if (user.permissions && user.permissions.length > 0) {
    const [module, action] = permission.split(":");
    return user.permissions.some(
      (p) => p.module === module && p.action === action && p.granted
    );
  }

  // Fallback: default permissions for developers without explicit grants.
  // Mantido em sincronia com DEFAULT_DEVELOPER_PERMISSIONS no backend
  // (backend/src/core/permissions/permission-keys.ts).
  const defaultDeveloperPermissions = [
    "projects:read",
    "modules:read", "modules:create",
    "epics:read", "epics:create",
    "tasks:read", "tasks:create", "tasks:update",
    "timelogs:create", "timelogs:read",
    "comments:create", "comments:read",
  ];
  return defaultDeveloperPermissions.includes(permission);
}
