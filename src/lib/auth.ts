import type { User, AuthSession, LoginCredentials } from "@/types";
import { mockUsers, mockLoginUsers } from "@/mocks/users";

const SESSION_KEY = "devflow_session";
const TOKEN_PREFIX = "devflow_fake_jwt_";

function generateFakeJWT(userId: string, role: string): string {
  const payload = {
    sub: userId,
    role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  return TOKEN_PREFIX + btoa(JSON.stringify(payload));
}

export function decodeFakeJWT(token: string): { sub: string; role: string; exp: number } | null {
  try {
    if (!token.startsWith(TOKEN_PREFIX)) return null;
    const encoded = token.replace(TOKEN_PREFIX, "");
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

export async function fakeLogin(credentials: LoginCredentials): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const loginUser = mockLoginUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!loginUser) {
    throw new Error("Credenciais inválidas. Verifique seu email e senha.");
  }

  const user = mockUsers.find((u) => u.id === loginUser.userId);
  if (!user) throw new Error("Usuário não encontrado.");

  const token = generateFakeJWT(user.id, user.role);
  const session: AuthSession = {
    user,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function fakeLogout(): void {
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
