"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, KeyRound, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CharCounter } from "@/components/shared/char-counter";
import { FIELD_LIMITS } from "@/lib/field-limits";

interface ApiTokenSummary {
  id: string;
  name: string;
  tokenPrefix: string;
  scopes: string[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  isActive: boolean;
}

interface CreateApiTokenResponse extends ApiTokenSummary {
  token: string;
}

const MODULES = [
  { key: "projects", label: "Projetos" },
  { key: "modules", label: "Módulos" },
  { key: "epics", label: "Épicos" },
  { key: "tasks", label: "Tarefas" },
  { key: "users", label: "Usuários" },
  { key: "timelogs", label: "Horas" },
  { key: "comments", label: "Comentários" },
  { key: "metrics", label: "Métricas" },
  { key: "audit", label: "Auditoria" },
] as const;

const ACTIONS = [
  { key: "read", label: "Ver" },
  { key: "create", label: "Criar" },
  { key: "update", label: "Editar" },
  { key: "delete", label: "Excluir" },
] as const;

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR");
}

export function ApiTokensPanel() {
  const [tokens, setTokens] = useState<ApiTokenSummary[]>([]);
  const [availableScopes, setAvailableScopes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(new Set());
  const [useAllScopes, setUseAllScopes] = useState(true);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const scopeSet = useMemo(() => new Set(availableScopes), [availableScopes]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tokensResponse, scopesResponse] = await Promise.all([
        api.get<{ tokens: ApiTokenSummary[] }>("api-tokens"),
        api.get<{ scopes: string[] }>("api-tokens/available-scopes"),
      ]);
      setTokens(tokensResponse.tokens);
      setAvailableScopes(scopesResponse.scopes);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar tokens");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function toggleScope(scope: string) {
    setSelectedScopes((current) => {
      const next = new Set(current);
      if (next.has(scope)) next.delete(scope);
      else next.add(scope);
      return next;
    });
  }

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Informe um nome para o token");
      return;
    }

    setIsCreating(true);
    try {
      const response = await api.post<CreateApiTokenResponse>("api-tokens", {
        name: name.trim(),
        scopes: useAllScopes ? undefined : [...selectedScopes],
      });
      setCreatedToken(response.token);
      setName("");
      setSelectedScopes(new Set());
      setUseAllScopes(true);
      await loadData();
      toast.success("Token criado. Copie agora — ele não será exibido novamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar token");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    try {
      await api.delete(`api-tokens/${id}`);
      await loadData();
      toast.success("Token revogado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao revogar token");
    }
  }

  async function copyToken() {
    if (!createdToken) return;
    await navigator.clipboard.writeText(createdToken);
    toast.success("Token copiado");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-zinc-100">Tokens de API</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-3">
          Use no header <code className="text-zinc-300">Authorization: Bearer df_...</code> para automatizar
          chamadas com as mesmas permissões da sua conta.
        </p>

        <details className="mb-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
          <summary className="cursor-pointer text-xs font-medium text-violet-300 select-none">
            Como criar tarefas via API (tutorial + teste)
          </summary>
          <div className="mt-3 space-y-2 text-xs text-zinc-400">
            <p>
              Para criar uma tarefa você precisa de <code className="text-zinc-300">projectId</code>,{" "}
              <code className="text-zinc-300">moduleId</code>, <code className="text-zinc-300">epicId</code> e{" "}
              <code className="text-zinc-300">assigneeId</code>. Descubra-os com os endpoints de leitura:
            </p>
            <pre className="overflow-x-auto rounded bg-zinc-950 px-3 py-2 text-[11px] text-zinc-300">{`# 1) listar projetos / módulos / épicos / usuários
GET  /api/projects
GET  /api/projects/:id/modules
GET  /api/projects/:id/epics
GET  /api/users

# 2) criar a tarefa
POST /api/tasks
{ "projectId", "moduleId", "epicId", "title",
  "description", "assigneeId", "reporterId" }`}</pre>
            <p>
              Teste rápido pelo terminal (descobre os IDs e cria sozinho):
            </p>
            <pre className="overflow-x-auto rounded bg-zinc-950 px-3 py-2 text-[11px] text-zinc-300">{`# só lista os IDs (não cria nada)
DEVFLOW_TOKEN=df_xxx node scripts/criar-tarefa-api.mjs --listar

# cria uma tarefa de teste
DEVFLOW_TOKEN=df_xxx node scripts/criar-tarefa-api.mjs`}</pre>
            <p className="text-zinc-500">
              Tutorial completo em <code className="text-zinc-300">docs/api-criar-tarefas.md</code>. Escopo
              necessário: <code className="text-zinc-300">tasks:create</code> (+ os <code className="text-zinc-300">:read</code> para descoberta).
            </p>
          </div>
        </details>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] items-start">
          <div className="space-y-1">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={FIELD_LIMITS.apiToken.name}
              placeholder="Nome do token (ex: Script CI, Automação local)"
              className="bg-zinc-950 border-zinc-800"
            />
            <div className="flex justify-end">
              <CharCounter value={name} max={FIELD_LIMITS.apiToken.name} />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={isCreating} className="gap-2">
            <Plus className="w-4 h-4" />
            Gerar token
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={useAllScopes}
              onChange={(event) => setUseAllScopes(event.target.checked)}
            />
            Usar todas as minhas permissões
          </label>

          {!useAllScopes && (
            <div className="rounded-lg border border-zinc-800 p-3 space-y-3">
              <p className="text-xs text-zinc-500">Selecione os escopos permitidos para este token:</p>
              {MODULES.map((module) => (
                <div key={module.key}>
                  <p className="text-xs font-medium text-zinc-400 mb-2">{module.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {ACTIONS.map((action) => {
                      const scope = `${module.key}:${action.key}`;
                      if (!scopeSet.has(scope)) return null;
                      const active = selectedScopes.has(scope);
                      return (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => toggleScope(scope)}
                          className={cn(
                            "px-2 py-1 rounded-md text-xs border transition-colors",
                            active
                              ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                              : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300",
                          )}
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {createdToken && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p className="text-xs text-emerald-300 mb-2 font-medium">
              Token gerado — copie agora. Não será mostrado novamente.
            </p>
            <div className="flex gap-2">
              <code className="flex-1 overflow-x-auto rounded bg-zinc-950 px-3 py-2 text-xs text-zinc-200">
                {createdToken}
              </code>
              <Button size="icon" variant="outline" onClick={copyToken}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Tokens ativos
        </p>

        {isLoading ? (
          <p className="text-sm text-zinc-500">Carregando...</p>
        ) : tokens.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum token criado ainda.</p>
        ) : (
          <div className="space-y-2">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-800/70 bg-zinc-950/60 p-3 md:flex-row md:items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-100">{token.name}</p>
                    <Badge
                      className={
                        token.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700"
                      }
                    >
                      {token.isActive ? "Ativo" : "Revogado"}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {token.tokenPrefix}… · criado {formatDate(token.createdAt)}
                    {token.lastUsedAt ? ` · último uso ${formatDate(token.lastUsedAt)}` : ""}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-1 truncate">
                    {token.scopes.length} escopo(s)
                  </p>
                </div>
                {token.isActive && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => handleRevoke(token.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Revogar
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
