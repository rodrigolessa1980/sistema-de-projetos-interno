"use client";

import { useState, type MouseEvent, type PointerEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useProjectStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Module } from "@/types";
import { ModuleEditDialog } from "./module-edit-dialog";

interface Props {
  module: Module;
  /** Chamado após excluir com sucesso (ex.: sair da página de detalhe do módulo). */
  afterDelete?: () => void;
  className?: string;
}

/**
 * Botões de editar (lápis) e excluir (lixeira) de um módulo, visíveis só para
 * admin ou o dono (createdById). Isola cliques para não disparar navegação do
 * card em volta. Uso em cards/linhas/detalhe de módulo por toda a aplicação.
 */
export function ModuleActions({ module, afterDelete, className }: Props) {
  const { user, isAdmin } = useAuth();
  const { deleteModule } = useProjectStore();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canModify = isAdmin || (!!module.createdById && module.createdById === user?.id);
  if (!canModify) return null;

  const stop = (e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDelete = async (e: MouseEvent) => {
    stop(e);
    const confirmed = window.confirm(
      `Excluir o módulo "${module.name}"?\n\nO módulo e suas tarefas/horas vinculadas serão ocultados (pode ser restaurado na Lixeira).`,
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteModule(module.id);
      toast.success("Módulo excluído");
      afterDelete?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir módulo");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)} onPointerDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        title="Editar módulo"
        aria-label="Editar módulo"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { stop(e); setEditing(true); }}
        className="p-1.5 rounded-md text-zinc-500 hover:text-violet-300 hover:bg-violet-500/10 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        title="Excluir módulo"
        aria-label="Excluir módulo"
        disabled={deleting}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleDelete}
        className="p-1.5 rounded-md text-zinc-500 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        {deleting ? (
          <div className="w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
      </button>

      {editing && <ModuleEditDialog module={module} open={editing} onOpenChange={setEditing} />}
    </div>
  );
}
