"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import {
  Upload, Trash2, Download, FileText, FileImage,
  FileVideo, FileArchive, File, Paperclip, X, AlertCircle,
} from "lucide-react";
import { useTaskStore } from "@/stores/task-store";
import { useUserStore } from "@/stores/ui-store";
import { useAuth } from "@/hooks/use-auth";
import { formatRelativeTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TaskAttachment } from "@/types";

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <FileImage className="w-4.5 h-4.5" />;
  if (mimeType.startsWith("video/")) return <FileVideo className="w-4.5 h-4.5" />;
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar"))
    return <FileArchive className="w-4.5 h-4.5" />;
  if (mimeType.includes("pdf") || mimeType.includes("text") || mimeType.includes("document"))
    return <FileText className="w-4.5 h-4.5" />;
  return <File className="w-4.5 h-4.5" />;
}

function getFileColor(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "text-violet-400 bg-violet-500/15";
  if (mimeType.startsWith("video/")) return "text-pink-400 bg-pink-500/15";
  if (mimeType.includes("pdf")) return "text-red-400 bg-red-500/15";
  if (mimeType.includes("zip") || mimeType.includes("rar")) return "text-amber-400 bg-amber-500/15";
  if (mimeType.includes("text") || mimeType.includes("document"))
    return "text-blue-400 bg-blue-500/15";
  return "text-zinc-400 bg-zinc-700/40";
}

interface AttachmentCardProps {
  attachment: TaskAttachment;
  onDelete: (id: string) => Promise<void>;
  currentUserId: string;
}

function AttachmentCard({ attachment, onDelete, currentUserId }: AttachmentCardProps) {
  const { users } = useUserStore();
  const uploader = users.find((u) => u.id === attachment.userId);
  const colorClass = getFileColor(attachment.type);
  const isImage = attachment.type.startsWith("image/");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    link.click();
    toast.success(`Download de "${attachment.name}" iniciado`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="group bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700/50 transition-colors"
    >
      {/* Preview de imagem */}
      {isImage && (
        <div className="w-full h-32 bg-zinc-800/60 overflow-hidden">
          <img
            src={attachment.dataUrl}
            alt={attachment.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-center gap-3 p-3">
        {/* Ícone */}
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
          <FileTypeIcon mimeType={attachment.type} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 truncate">{attachment.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-zinc-500">{formatBytes(attachment.size)}</span>
            <span className="text-[10px] text-zinc-700">·</span>
            <div className="flex items-center gap-1">
              <Avatar className="w-3.5 h-3.5">
                <AvatarImage src={uploader?.avatar} />
                <AvatarFallback className="text-[6px] bg-zinc-700">
                  {uploader?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] text-zinc-500">{uploader?.name?.split(" ")[0]}</span>
            </div>
            <span className="text-[10px] text-zinc-700">·</span>
            <span className="text-[10px] text-zinc-500">
              {formatRelativeTime(attachment.createdAt)}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
            title="Baixar arquivo"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={async () => {
              try {
                await onDelete(attachment.id);
                toast.success("Anexo removido");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Erro ao remover anexo");
              }
            }}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Remover anexo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface AttachmentsPanelProps {
  taskId: string;
}

export function AttachmentsPanel({ taskId }: AttachmentsPanelProps) {
  const { getAttachmentsByTask, addAttachment, deleteAttachment, fetchAttachmentsForTask } = useTaskStore();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);

  const attachments = getAttachmentsByTask(taskId);

  // Anexos são carregados sob demanda (base64 pesado não vem no bootstrap).
  useEffect(() => {
    fetchAttachmentsForTask(taskId);
  }, [taskId, fetchAttachmentsForTask]);

  const processFile = useCallback(
    async (file: File) => {
      if (!user) return;
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`"${file.name}" excede o limite de ${MAX_SIZE_MB}MB`);
        return;
      }

      setUploading((prev) => [...prev, file.name]);

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () =>
            reject(new Error(`Não foi possível ler "${file.name}" — arquivo corrompido ou inacessível`));
          reader.readAsDataURL(file);
        });

        // Chamada real ao backend: persiste de verdade (sem confirmação manual).
        await addAttachment({
          taskId,
          userId: user.id,
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl,
        });

        toast.success(`"${file.name}" anexado com sucesso`);
      } catch (error) {
        // Feedback real: mostra o motivo (limite 10MB, corrompido, falha de rede, etc.).
        toast.error(error instanceof Error ? error.message : `Erro ao anexar "${file.name}"`);
      } finally {
        setUploading((prev) => prev.filter((n) => n !== file.name));
      }
    },
    [user, taskId, addAttachment]
  );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(processFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Zona de drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-all",
          isDragging
            ? "border-violet-500/60 bg-violet-500/10 scale-[1.01]"
            : "border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/20"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
          isDragging ? "bg-violet-500/20" : "bg-zinc-800/60"
        )}>
          <Upload className={cn("w-5 h-5 transition-colors", isDragging ? "text-violet-400" : "text-zinc-500")} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">
            {isDragging ? "Solte o arquivo aqui" : "Clique ou arraste arquivos"}
          </p>
          <p className="text-xs text-zinc-600 mt-0.5">
            Qualquer tipo de arquivo · Máximo {MAX_SIZE_MB}MB por arquivo
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          onClick={(e) => (e.currentTarget.value = "")}
        />
      </div>

      {/* Uploads em andamento */}
      <AnimatePresence>
        {uploading.map((name) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-300 truncate">{name}</p>
              <div className="h-1 bg-zinc-700 rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-violet-500 rounded-full"
                  initial={{ width: "5%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <span className="text-xs text-zinc-500 shrink-0">Enviando...</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Lista de anexos */}
      {attachments.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            {attachments.length} anexo{attachments.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 gap-2">
            <AnimatePresence>
              {attachments.map((att) => (
                <AttachmentCard
                  key={att.id}
                  attachment={att}
                  currentUserId={user?.id ?? ""}
                  onDelete={deleteAttachment}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        uploading.length === 0 && (
          <div className="flex flex-col items-center py-6 text-center">
            <Paperclip className="w-7 h-7 text-zinc-700 mb-2" />
            <p className="text-sm text-zinc-500">Nenhum arquivo anexado</p>
            <p className="text-xs text-zinc-600 mt-0.5">
              Faça upload de documentos, imagens, relatórios e mais
            </p>
          </div>
        )
      )}
    </div>
  );
}
