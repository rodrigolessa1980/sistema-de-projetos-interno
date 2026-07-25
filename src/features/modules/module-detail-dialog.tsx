"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagePreviewDialog } from "@/components/shared/image-preview-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Box, Calendar, Clock, File, FileImage, FileText, Download,
  User2, MessageSquare, Paperclip,
} from "lucide-react";
import { cn, moduleColorFromId, shortId } from "@/lib/utils";
import { toast } from "sonner";
import type { Module, Task, TimeLog, ModuleAttachment, User } from "@/types";
import type { ModuleStatus } from "@/types";
import { ModuleAttachmentsPanel } from "./module-attachments-panel";
import { ExpandableText } from "@/components/shared/expandable-text";

const moduleStatusLabels: Record<ModuleStatus, string> = {
  INICIADO: "Iniciado",
  EM_PROCESSO: "Em processo",
  CONCLUIDO: "Concluído",
};

const moduleStatusClasses: Record<ModuleStatus, string> = {
  INICIADO: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  EM_PROCESSO: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  CONCLUIDO: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const iso = dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function ReadOnlyAttachment({ attachment }: { attachment: ModuleAttachment }) {
  const isImage = attachment.type.startsWith("image/");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    link.click();
    toast.success(`Download de "${attachment.name}" iniciado`);
  };

  return (
    <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg overflow-hidden">
      {isImage && (
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="block w-full max-h-48 bg-zinc-800 overflow-hidden cursor-zoom-in"
          title="Clique para ampliar"
        >
          <img
            src={attachment.dataUrl}
            alt={attachment.name}
            className="w-full h-full object-contain max-h-48"
          />
        </button>
      )}
      {isImage && (
        <ImagePreviewDialog
          image={previewOpen ? { dataUrl: attachment.dataUrl, name: attachment.name } : null}
          onClose={() => setPreviewOpen(false)}
        />
      )}
      <div className="flex items-center gap-2.5 p-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isImage ? "text-violet-400 bg-violet-500/15" : "text-zinc-400 bg-zinc-700/40",
        )}>
          {isImage ? <FileImage className="w-4 h-4" /> : (
            attachment.type.includes("pdf") ? <FileText className="w-4 h-4" /> : <File className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-200 truncate">{attachment.name}</p>
          <p className="text-[10px] text-zinc-500">{formatBytes(attachment.size)}</p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="p-1.5 rounded text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors shrink-0"
          title="Baixar"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface Props {
  module: Module | null;
  tasks: Task[];
  timeLogs: TimeLog[];
  attachments: ModuleAttachment[];
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canUpload?: boolean;
}

export function ModuleDetailDialog({
  module,
  tasks,
  timeLogs,
  attachments,
  users,
  open,
  onOpenChange,
  canUpload = false,
}: Props) {
  if (!module) return null;

  const moduleTaskIds = new Set(tasks.map((t) => t.id));
  const moduleLogs = timeLogs
    .filter((log) => moduleTaskIds.has(log.taskId))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  const totalHours = moduleLogs.length > 0
    ? moduleLogs.reduce((sum, log) => sum + log.hours, 0)
    : (module.loggedHours ?? 0);
  const primaryLog = moduleLogs[0];
  const workDate = primaryLog?.date
    ?? module.workDate
    ?? module.createdAt.split("T")[0];
  const primaryUserId = primaryLog?.userId ?? module.loggedByUserId;
  const primaryUser = primaryUserId ? users.find((u) => u.id === primaryUserId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700/50 text-zinc-100 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100 pr-8 min-w-0">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: moduleColorFromId(module.id) }} />
            <Box className="w-5 h-5 text-violet-400 shrink-0" />
            <span className="truncate">{module.name}</span>
            <span className="ml-1 shrink-0 rounded bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">{shortId(module.id)}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Resumo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
                <Box className="w-3 h-3" /> Status
              </div>
              <Badge className={`text-[9px] ${moduleStatusClasses[module.status ?? "INICIADO"]}`}>
                {moduleStatusLabels[module.status ?? "INICIADO"]}
              </Badge>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
                <Calendar className="w-3 h-3" /> Data do trabalho
              </div>
              <p className="text-xs font-medium text-zinc-200">
                {formatDate(workDate)}
              </p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
                <Clock className="w-3 h-3" /> Horas registradas
              </div>
              <p className="text-xs font-medium text-violet-300">
                {totalHours > 0 ? `${totalHours.toFixed(1)}h` : "—"}
              </p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
                <User2 className="w-3 h-3" /> Responsável
              </div>
              {primaryUser ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={primaryUser.avatar} />
                    <AvatarFallback className="text-[8px] bg-zinc-700">
                      {primaryUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium text-zinc-200 truncate">{primaryUser.name}</p>
                </div>
              ) : (
                <p className="text-xs text-zinc-500">—</p>
              )}
            </div>
          </div>

          {/* Observação / descrição */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Observação
            </h4>
            <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-3">
              <ExpandableText
                text={module.description?.trim() || primaryLog?.description}
                collapsedLines={8}
              />
            </div>
          </div>

          {/* Registros de horas */}
          {moduleLogs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Registros de trabalho
              </h4>
              <div className="space-y-2">
                {moduleLogs.map((log) => {
                  const logUser = users.find((u) => u.id === log.userId);
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg"
                    >
                      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                        <AvatarImage src={logUser?.avatar} />
                        <AvatarFallback className="text-[9px] bg-zinc-700">
                          {logUser?.name?.slice(0, 2).toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-medium text-zinc-200">
                            {logUser?.name ?? "Usuário"}
                          </span>
                          <Badge className="text-[9px] bg-violet-500/20 text-violet-300 border-violet-500/30">
                            {log.hours.toFixed(1)}h
                          </Badge>
                          <span className="text-[10px] text-zinc-500">
                            {formatDate(log.date)}
                          </span>
                        </div>
                        {log.description && (
                          <p className="text-xs text-zinc-400">{log.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Evidências / anexos */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" /> Evidências ({attachments.length})
            </h4>
            {attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments.map((att) => (
                  <ReadOnlyAttachment key={att.id} attachment={att} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-600 italic py-2">Nenhum arquivo anexado a este módulo.</p>
            )}
            {canUpload && (
              <ModuleAttachmentsPanel moduleId={module.id} />
            )}
          </div>

          {/* Meta */}
          <p className="text-[10px] text-zinc-600 pt-1 border-t border-zinc-800">
            Módulo criado em {formatDate(module.createdAt.split("T")[0])}
            {tasks.length > 0 && ` · ${tasks.length} tarefa${tasks.length !== 1 ? "s" : ""} vinculada${tasks.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
