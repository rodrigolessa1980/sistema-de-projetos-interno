"use client";

import { useState, type MouseEvent, type PointerEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useTaskStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { TaskEditDialog } from "./task-edit-dialog";

interface Props {
  task: Task;
  /** Chamado após excluir com sucesso (ex.: navegar pra fora da página de detalhe). */
  afterDelete?: () => void;
  className?: string;
}

/**
 * Botões de editar (lápis) e excluir (lixeira) de uma tarefa, visíveis só para
 * admin ou o autor (reporterId). Isola cliques para não disparar navegação/drag
 * do card em volta. Uso em cards/linhas de tarefa por toda a aplicação.
 */
export function TaskActions({ task, afterDelete, className }: Props) {
  const { user, isAdmin } = useAuth();
  const { deleteTask } = useTaskStore();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canModify = isAdmin || user?.id === task.reporterId;
  if (!canModify) return null;

  const stop = (e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDelete = async (e: MouseEvent) => {
    stop(e);
    const confirmed = window.confirm(
      `Excluir a tarefa "${task.title}"?\n\nEla será removida das listas, do kanban e dos relatórios (pode ser restaurada na Lixeira).`,
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Tarefa excluída");
      afterDelete?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir tarefa");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)} onPointerDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        title="Editar tarefa"
        aria-label="Editar tarefa"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { stop(e); setEditing(true); }}
        className="p-1.5 rounded-md text-zinc-500 hover:text-violet-300 hover:bg-violet-500/10 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        title="Excluir tarefa"
        aria-label="Excluir tarefa"
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

      {editing && <TaskEditDialog task={task} open={editing} onOpenChange={setEditing} />}
    </div>
  );
}
