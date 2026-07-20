"use client";

import { useState } from "react";
import { useTaskStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatRelativeTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Comment } from "@/types";

// updatedAt bem depois de createdAt = foi editado (limiar evita falso-positivo na criação).
const EDIT_THRESHOLD_MS = 2000;

export function CommentItem({ comment }: { comment: Comment }) {
  const { users } = useUserStore();
  const { user, isAdmin } = useAuth();
  const { updateComment, deleteComment } = useTaskStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [busy, setBusy] = useState(false);

  const author = users.find((u) => u.id === comment.userId);
  const canManage = isAdmin || comment.userId === user?.id;
  const isDeleted = !!comment.deletedAt;
  const wasEdited =
    !isDeleted &&
    new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > EDIT_THRESHOLD_MS;

  async function save() {
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    try {
      await updateComment(comment.id, text);
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível editar o comentário.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Apagar este comentário? Ele ficará marcado como apagado no histórico.")) return;
    setBusy(true);
    try {
      await deleteComment(comment.id);
      toast.success("Comentário apagado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível apagar o comentário.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-3 bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 group">
      <Avatar className="w-7 h-7 shrink-0">
        <AvatarImage src={author?.avatar} />
        <AvatarFallback className="text-[9px] bg-zinc-700">{author?.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-zinc-300">{author?.name}</span>
          <span className="text-[10px] text-zinc-600">{formatRelativeTime(comment.createdAt)}</span>
          {wasEdited && <span className="text-[10px] text-zinc-600 italic">(editado)</span>}
          {canManage && !isDeleted && !editing && (
            <span className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setDraft(comment.content);
                  setEditing(true);
                }}
                className="p-1 rounded text-zinc-500 hover:text-violet-300 hover:bg-violet-500/10"
                title="Editar"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={remove}
                disabled={busy}
                className="p-1 rounded text-zinc-500 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                title="Apagar"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {isDeleted ? (
          <p className="text-sm text-zinc-600 italic">Comentário apagado</p>
        ) : editing ? (
          <div className="space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 text-sm resize-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={busy} className="h-7 text-xs text-zinc-400">
                Cancelar
              </Button>
              <Button size="sm" onClick={save} disabled={busy || !draft.trim()} className="h-7 text-xs bg-violet-600 hover:bg-violet-700">
                {busy ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        )}
      </div>
    </div>
  );
}
