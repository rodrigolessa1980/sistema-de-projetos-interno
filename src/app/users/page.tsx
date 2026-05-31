"use client";

import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { EmptyState } from "@/components/shared/empty-state";
import { Users, ShieldCheck, Save, RotateCcw, Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Módulos do sistema com suas labels
// ──────────────────────────────────────────────
const MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "projetos", label: "Projetos" },
  { key: "tarefas", label: "Tarefas" },
  { key: "kanban", label: "Kanban" },
  { key: "gantt", label: "Gantt" },
  { key: "modulos", label: "Módulos" },
  { key: "epicos", label: "Épicos" },
  { key: "fila", label: "Fila de Desenvolvimento" },
  { key: "dependencias", label: "Dependências" },
  { key: "registro_horas", label: "Registro de Horas" },
  { key: "relatorios", label: "Relatórios" },
  { key: "metricas", label: "Métricas" },
  { key: "empresas", label: "Empresas" },
  { key: "usuarios", label: "Gestão de Usuários" },
];

const ACTIONS = [
  { key: "visualizar", label: "Visualizar" },
  { key: "criar", label: "Criar" },
  { key: "editar", label: "Editar" },
  { key: "excluir", label: "Excluir" },
];

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type PermissionMap = Record<string, Record<string, boolean>>; // module -> action -> granted

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  position: string;
  department: string;
  isActive: boolean;
  lastLoginAt: string | null;
  permissionCount: number;
  permissions: { module: string; action: string; granted: boolean }[];
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function buildPermissionMap(permissions: { module: string; action: string; granted: boolean }[]): PermissionMap {
  const map: PermissionMap = {};
  for (const mod of MODULES) {
    map[mod.key] = {};
    for (const act of ACTIONS) {
      map[mod.key][act.key] = false;
    }
  }
  for (const p of permissions) {
    if (map[p.module]) map[p.module][p.action] = p.granted;
  }
  return map;
}

function flattenPermissionMap(map: PermissionMap): { module: string; action: string; granted: boolean }[] {
  const result: { module: string; action: string; granted: boolean }[] = [];
  for (const mod of Object.keys(map)) {
    for (const action of Object.keys(map[mod])) {
      result.push({ module: mod, action, granted: map[mod][action] });
    }
  }
  return result;
}

function countGranted(map: PermissionMap): number {
  let count = 0;
  for (const mod of Object.values(map)) {
    for (const granted of Object.values(mod)) {
      if (granted) count++;
    }
  }
  return count;
}

function formatLastLogin(date: string | null): string {
  if (!date) return "nunca";
  return new Date(date).toLocaleDateString("pt-BR");
}

// ──────────────────────────────────────────────
// Page Component
// ──────────────────────────────────────────────
export default function UsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [permMap, setPermMap] = useState<PermissionMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const selectedUser = users.find((u) => u.id === selectedId) ?? null;

  // Carregar lista de usuários
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<ApiUser[]>("users");
      setUsers(data);
      if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id);
        setPermMap(buildPermissionMap(data[0].permissions));
      }
    } catch (e) {
      console.error("Erro ao carregar usuários", e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { loadUsers(); }, []);

  // Selecionar usuário
  function selectUser(user: ApiUser) {
    setSelectedId(user.id);
    setPermMap(buildPermissionMap(user.permissions));
  }

  // Toggle individual
  function togglePerm(module: string, action: string) {
    setPermMap((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: !prev[module][action] },
    }));
  }

  // Marcar/limpar linha inteira (módulo)
  function toggleRow(module: string, grant: boolean) {
    setPermMap((prev) => {
      const updated = { ...prev[module] };
      for (const act of ACTIONS) updated[act.key] = grant;
      return { ...prev, [module]: updated };
    });
  }

  // Marcar/limpar coluna inteira (ação)
  function toggleColumn(action: string, grant: boolean) {
    setPermMap((prev) => {
      const next = { ...prev };
      for (const mod of MODULES) {
        next[mod.key] = { ...next[mod.key], [action]: grant };
      }
      return next;
    });
  }

  // Verificar se coluna está toda marcada
  function isColumnAll(action: string): boolean {
    return MODULES.every((m) => permMap[m.key]?.[action]);
  }

  // Verificar se linha está toda marcada
  function isRowAll(module: string): boolean {
    return ACTIONS.every((a) => permMap[module]?.[a.key]);
  }

  // Salvar permissões
  async function savePermissions() {
    if (!selectedId) return;
    setIsSaving(true);
    try {
      await api.put(`users/${selectedId}/permissions`, { permissions: flattenPermissionMap(permMap) });
      // Atualizar contagem na lista local
      const granted = countGranted(permMap);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedId
            ? { ...u, permissionCount: granted, permissions: flattenPermissionMap(permMap) }
            : u
        )
      );
    } catch (e) {
      console.error("Erro ao salvar permissões", e);
    } finally {
      setIsSaving(false);
    }
  }

  // Resetar para o original
  function resetPermissions() {
    if (!selectedUser) return;
    setPermMap(buildPermissionMap(selectedUser.permissions));
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <EmptyState icon={Users} title="Acesso Restrito" description="Apenas administradores podem gerenciar usuários." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* ── Painel Esquerdo: Lista de Usuários ── */}
        <div className="w-80 min-w-[300px] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Usuários ({users.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex-1 divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className={cn(
                    "w-full text-left p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    selectedId === user.id
                      ? "border-l-2 border-violet-500 bg-violet-50/50 dark:bg-violet-950/20"
                      : "border-l-2 border-transparent"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                          {user.name}
                        </span>
                        <Badge
                          className={cn(
                            "text-[9px] px-1 py-0 shrink-0",
                            user.role === "ADMIN"
                              ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                          )}
                        >
                          {user.role === "ADMIN" ? "ADMIN" : "DEV"}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {user.permissionCount} permissões · último login {formatLastLogin(user.lastLoginAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Painel Direito: Matriz de Permissões ── */}
        <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              <p className="text-sm">Selecione um usuário para gerenciar permissões</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                    Permissões — {selectedUser.name}
                  </h2>
                  <p className="text-sm text-zinc-500">{selectedUser.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetPermissions}
                    className="text-zinc-500 hover:text-zinc-700 gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Resetar
                  </Button>
                  <Button
                    size="sm"
                    onClick={savePermissions}
                    disabled={isSaving}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? "Salvando..." : "Salvar permissões"}
                  </Button>
                </div>
              </div>

              {/* Tabela de Permissões */}
              <div className="flex-1 overflow-auto p-6">
                <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="text-left px-5 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider w-48">
                          Módulo
                        </th>
                        {ACTIONS.map((act) => (
                          <th key={act.key} className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                {act.label}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleColumn(act.key, true)}
                                  title="Marcar todos"
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 font-medium"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => toggleColumn(act.key, false)}
                                  title="Desmarcar todos"
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 font-medium"
                                >
                                  −
                                </button>
                              </div>
                            </div>
                          </th>
                        ))}
                        <th className="px-4 py-3 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          Linha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                      {MODULES.map((mod, idx) => {
                        const rowAll = isRowAll(mod.key);
                        return (
                          <tr
                            key={mod.key}
                            className={cn(
                              "hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
                              idx % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-900/20"
                            )}
                          >
                            <td className="px-5 py-3.5">
                              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {idx + 1} — {mod.label}
                              </span>
                            </td>
                            {ACTIONS.map((act) => {
                              const checked = permMap[mod.key]?.[act.key] ?? false;
                              return (
                                <td key={act.key} className="px-4 py-3.5 text-center">
                                  <button
                                    onClick={() => togglePerm(mod.key, act.key)}
                                    className="inline-flex items-center justify-center w-5 h-5 rounded"
                                  >
                                    {checked ? (
                                      <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded border-2 border-zinc-300 dark:border-zinc-600" />
                                    )}
                                  </button>
                                </td>
                              );
                            })}
                            <td className="px-4 py-3.5 text-center">
                              <button
                                onClick={() => toggleRow(mod.key, !rowAll)}
                                className={cn(
                                  "text-xs px-2.5 py-1 rounded font-medium transition-colors",
                                  rowAll
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                                    : "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200"
                                )}
                              >
                                {rowAll ? "limpar" : "marcar tudo"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Resumo */}
                  <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {countGranted(permMap)} de {MODULES.length * ACTIONS.length} permissões concedidas
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const all: PermissionMap = {};
                          for (const m of MODULES) {
                            all[m.key] = {};
                            for (const a of ACTIONS) all[m.key][a.key] = true;
                          }
                          setPermMap(all);
                        }}
                        className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
                      >
                        Conceder todas
                      </button>
                      <span className="text-zinc-300 dark:text-zinc-600">·</span>
                      <button
                        onClick={() => {
                          const none: PermissionMap = {};
                          for (const m of MODULES) {
                            none[m.key] = {};
                            for (const a of ACTIONS) none[m.key][a.key] = false;
                          }
                          setPermMap(none);
                        }}
                        className="text-xs text-zinc-500 hover:underline"
                      >
                        Revogar todas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
