"use client";

import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Plus, Pencil, Trash2, ArrowRightLeft, UserCog, MessageSquare, Clock } from "lucide-react";

export interface AuditEntry {
  id: string;
  entityType: "TASK" | "PROJECT" | "MODULE" | "EPIC" | "USER" | string;
  entityId: string;
  action: string;
  userId: string;
  userName: string | null;
  description: string;
  previousValue?: unknown;
  newValue?: unknown;
  createdAt: string;
}

export const ACTION_LABEL: Record<string, string> = {
  CREATED: "Criou",
  UPDATED: "Atualizou",
  DELETED: "Excluiu",
  STATUS_CHANGED: "Mudou o status",
  ASSIGNED: "Reatribuiu",
  COMMENTED: "Comentou",
  TIME_LOGGED: "Registrou horas",
};

export const ENTITY_LABEL: Record<string, string> = {
  TASK: "Tarefa",
  PROJECT: "Projeto",
  MODULE: "Módulo",
  EPIC: "Épico",
  USER: "Usuário",
};

const ACTION_STYLE: Record<string, string> = {
  CREATED: "bg-emerald-500/15 text-emerald-300",
  UPDATED: "bg-blue-500/15 text-blue-300",
  DELETED: "bg-red-500/15 text-red-300",
  STATUS_CHANGED: "bg-violet-500/15 text-violet-300",
  ASSIGNED: "bg-amber-500/15 text-amber-300",
  COMMENTED: "bg-cyan-500/15 text-cyan-300",
  TIME_LOGGED: "bg-zinc-600/30 text-zinc-300",
};

const GENERIC = /^(GET|POST|PUT|PATCH|DELETE)\s/;

/** Alvo humanizado a partir do path genérico (fallback p/ ações não enriquecidas). */
function humanizeTarget(description: string): string {
  if (/\/comments/.test(description)) return "um comentário";
  if (/\/subtasks/.test(description)) return "uma subtarefa";
  if (/\/attachments/.test(description)) return "um anexo";
  if (/\/notes/.test(description)) return "uma anotação";
  if (/\/dependencies/.test(description)) return "uma dependência";
  if (/\/urgent/.test(description)) return "a urgência";
  return "o registro";
}

/** Texto humano do que aconteceu: usa a descrição rica do use-case; senão deriva do path. */
export function describeEntry(e: AuditEntry): string {
  if (e.description && !GENERIC.test(e.description)) return e.description;
  const label = ACTION_LABEL[e.action] ?? e.action;
  return `${label} ${humanizeTarget(e.description ?? "")}`;
}

function ActionIcon({ action }: { action: string }) {
  if (action === "CREATED") return <Plus className="w-3 h-3" />;
  if (action === "DELETED") return <Trash2 className="w-3 h-3" />;
  if (action === "STATUS_CHANGED") return <ArrowRightLeft className="w-3 h-3" />;
  if (action === "ASSIGNED") return <UserCog className="w-3 h-3" />;
  if (action === "COMMENTED") return <MessageSquare className="w-3 h-3" />;
  if (action === "TIME_LOGGED") return <Clock className="w-3 h-3" />;
  return <Pencil className="w-3 h-3" />;
}

export function fetchAuditLogs(params: { entityId?: string; limit?: number }): Promise<AuditEntry[]> {
  const query: Record<string, string> = { limit: String(params.limit ?? 100) };
  if (params.entityId) query.entityId = params.entityId;
  return api.get<AuditEntry[]>("audit-logs", { params: query });
}

/** Linha da timeline de auditoria. `showEntity` inclui o tipo/entidade (tela geral). */
export function AuditRow({ entry, showEntity }: { entry: AuditEntry; showEntity?: boolean }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-800/30 px-3 py-2.5">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${ACTION_STYLE[entry.action] ?? "bg-zinc-700/40 text-zinc-300"}`}
      >
        <ActionIcon action={entry.action} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-200">
          <span className="font-semibold">{entry.userName ?? "Alguém"}</span>{" "}
          <span className="text-zinc-400">{describeEntry(entry)}</span>
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {showEntity && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
              {ENTITY_LABEL[entry.entityType] ?? entry.entityType}
            </span>
          )}
          <span className="text-[11px] text-zinc-500">{formatDateTime(entry.createdAt)}</span>
        </div>
      </div>
    </li>
  );
}
