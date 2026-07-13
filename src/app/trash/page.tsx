"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/page-loading";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "@/lib/motion";
import {
  Trash2, RotateCcw, FolderKanban, Box, ClipboardList, Clock,
  Building2, Paperclip, ShieldAlert,
} from "lucide-react";

type TrashType =
  | "project" | "module" | "task" | "timelog" | "company"
  | "module-attachment" | "showcase-attachment" | "demand-attachment";

interface TrashItem {
  type: TrashType;
  id: string;
  label: string;
  deletedAt: string;
  context?: string;
}

const TYPE_META: Record<TrashType, { label: string; icon: typeof Box }> = {
  project: { label: "Projeto", icon: FolderKanban },
  module: { label: "Módulo", icon: Box },
  task: { label: "Tarefa", icon: ClipboardList },
  timelog: { label: "Registro de tempo", icon: Clock },
  company: { label: "Empresa", icon: Building2 },
  "module-attachment": { label: "Anexo de módulo", icon: Paperclip },
  "showcase-attachment": { label: "Anexo (galeria)", icon: Paperclip },
  "demand-attachment": { label: "Anexo (demanda)", icon: Paperclip },
};

function formatWhen(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR");
}

export default function TrashPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ items: TrashItem[] }>("trash");
      setItems(res?.items ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar a lixeira");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  async function handleRestore(item: TrashItem) {
    setBusyId(item.id);
    try {
      await api.post(`trash/${item.type}/${item.id}/restore`);
      setItems((prev) => prev.filter((i) => !(i.id === item.id && i.type === item.type)));
      toast.success(`${TYPE_META[item.type].label} restaurado`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao restaurar");
    } finally {
      setBusyId(null);
    }
  }

  async function handlePurge(item: TrashItem) {
    const confirmed = window.confirm(
      `Excluir DEFINITIVAMENTE "${item.label}"?\n\nEsta ação não pode ser desfeita — os dados serão apagados de vez.`,
    );
    if (!confirmed) return;
    setBusyId(item.id);
    try {
      await api.delete(`trash/${item.type}/${item.id}`);
      setItems((prev) => prev.filter((i) => !(i.id === item.id && i.type === item.type)));
      toast.success("Excluído definitivamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir definitivamente");
    } finally {
      setBusyId(null);
    }
  }

  if (!isAdmin) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Acesso restrito"
        description="Apenas administradores podem acessar a lixeira."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Lixeira"
        description={
          loading
            ? "Carregando itens excluídos..."
            : `${items.length} item${items.length !== 1 ? "s" : ""} excluído${items.length !== 1 ? "s" : ""} — restaure ou remova de vez`
        }
      />

      <div className="p-6 w-full">
        {loading ? (
          <PageLoading label="Carregando lixeira..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Trash2}
            title="Lixeira vazia"
            description="Nada foi excluído. Quando alguém excluir um projeto, módulo, tarefa, hora ou anexo, ele aparece aqui e pode ser restaurado."
          />
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => {
              const meta = TYPE_META[item.type];
              const Icon = meta.icon;
              const busy = busyId === item.id;
              return (
                <motion.div
                  key={`${item.type}:${item.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-3 hover:border-zinc-700/50 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-800/70 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 shrink-0">
                        {meta.label}
                      </span>
                      <span className="text-sm text-zinc-200 truncate">{item.label}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {item.context ? `${item.context} · ` : ""}excluído em {formatWhen(item.deletedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => handleRestore(item)}
                      className="h-8 px-2.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restaurar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => handlePurge(item)}
                      className="h-8 px-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir de vez
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
