"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pin, PinOff, Pencil, Trash2, Plus, Check, X,
  StickyNote, ChevronDown, ChevronUp, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTaskStore } from "@/stores/task-store";
import { useUserStore } from "@/stores/ui-store";
import { useAuth } from "@/hooks/use-auth";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TaskNote } from "@/types";

interface NoteCardProps {
  note: TaskNote;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTogglePin: (id: string) => Promise<void>;
  currentUserId: string;
}

function NoteCard({ note, onUpdate, onDelete, onTogglePin, currentUserId }: NoteCardProps) {
  const { users } = useUserStore();
  const author = users.find((u) => u.id === note.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [isExpanded, setIsExpanded] = useState(true);
  const isOwner = note.userId === currentUserId;

  // Renderização simples de markdown (negrito, código, links, quebras de linha)
  const renderMarkdown = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        // Heading ## 
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="text-sm font-semibold text-zinc-100 mt-2 mb-1">
              {line.replace("## ", "")}
            </p>
          );
        }
        // Linha vazia
        if (line.trim() === "") return <br key={i} />;

        // Processar inline: **bold**, `code`, - lista
        const isList = line.startsWith("- ");
        const content = (isList ? line.slice(2) : line)
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-zinc-800 text-violet-300 text-[11px] font-mono">$1</code>');

        if (isList) {
          return (
            <li
              key={i}
              className="text-sm text-zinc-300 leading-relaxed ml-3 list-disc"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        return (
          <p
            key={i}
            className="text-sm text-zinc-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      });
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;
    await onUpdate(note.id, editContent.trim());
    setIsEditing(false);
    toast.success("Anotação atualizada");
  };

  const handleDiscard = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "rounded-xl border transition-colors group",
        note.isPinned
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-zinc-800/50 bg-zinc-900/60"
      )}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-6 h-6 shrink-0">
            <AvatarImage src={author?.avatar} />
            <AvatarFallback className="text-[8px] bg-zinc-700">
              {author?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-300">{author?.name?.split(" ")[0]}</span>
            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formatRelativeTime(note.updatedAt)}
            </span>
          </div>
          {note.isPinned && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/20 font-medium">
              Fixada
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(note.id)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            title={note.isPinned ? "Desafixar" : "Fixar anotação"}
          >
            {note.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          {isOwner && (
            <>
              <button
                onClick={() => { setIsEditing(true); setIsExpanded(true); }}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                title="Editar"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={async () => { await onDelete(note.id); toast.success("Anotação removida"); }}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-zinc-800/40 pt-3">
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="bg-zinc-800/80 border-zinc-700 text-zinc-100 text-sm font-mono leading-relaxed resize-none min-h-[120px]"
                    placeholder="Suporte a markdown: **negrito**, `código`, ## Título, - lista"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-[10px] text-zinc-600 mr-auto">
                      Suporte básico a **negrito**, `código`, ## Título, - lista
                    </p>
                    <button
                      onClick={handleDiscard}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">{renderMarkdown(note.content)}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface NotesPanelProps {
  taskId: string;
}

export function NotesPanel({ taskId }: NotesPanelProps) {
  const { getNotesByTask, addNote, updateNote, deleteNote, togglePinNote } = useTaskStore();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const notes = getNotesByTask(taskId);

  const handleAdd = async () => {
    if (!newContent.trim() || !user) return;
    await addNote({
      taskId,
      userId: user.id,
      content: newContent.trim(),
      isPinned: false,
    });
    setNewContent("");
    setIsAdding(false);
    toast.success("Anotação salva");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter para salvar
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewContent("");
    }
  };

  return (
    <div className="space-y-3">
      {/* Botão / formulário de nova anotação */}
      <AnimatePresence mode="wait">
        {!isAdding ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsAdding(true); setTimeout(() => textareaRef.current?.focus(), 50); }}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-zinc-700/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/30 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar anotação...
          </motion.button>
        ) : (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-violet-500/30 bg-violet-500/5 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <StickyNote className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300">Nova Anotação</span>
              <span className="text-[10px] text-zinc-600 ml-auto">Ctrl+Enter para salvar · Esc para cancelar</span>
            </div>
            <Textarea
              ref={textareaRef}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Escreva sua anotação...\n\nSuporta markdown básico:\n## Título\n**negrito**\n\`código\`\n- item de lista`}
              className="bg-transparent border-0 border-t border-violet-500/20 text-zinc-200 text-sm font-mono leading-relaxed resize-none min-h-[140px] rounded-none focus-visible:ring-0 placeholder:text-zinc-600"
            />
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-violet-500/20">
              <button
                onClick={() => { setIsAdding(false); setNewContent(""); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={!newContent.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Salvar anotação
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de anotações */}
      <AnimatePresence>
        {notes.length === 0 && !isAdding ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <StickyNote className="w-8 h-8 text-zinc-700 mb-2" />
            <p className="text-sm text-zinc-500">Nenhuma anotação ainda</p>
            <p className="text-xs text-zinc-600 mt-0.5">Adicione notas, referências e observações sobre esta task</p>
          </motion.div>
        ) : (
          <motion.div className="space-y-2">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                currentUserId={user?.id ?? ""}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onTogglePin={togglePinNote}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
