"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import {
  Upload, Trash2, Download, FileText, FileImage,
  FileVideo, FileArchive, File, Paperclip,
} from "lucide-react";
import { useTaskStore } from "@/stores/task-store";
import { useUserStore } from "@/stores/ui-store";
import { useAuth } from "@/hooks/use-auth";
import { formatRelativeTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ModuleAttachment } from "@/types";

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <FileImage className="w-4 h-4" />;
  if (mimeType.startsWith("video/")) return <FileVideo className="w-4 h-4" />;
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar"))
    return <FileArchive className="w-4 h-4" />;
  if (mimeType.includes("pdf") || mimeType.includes("text") || mimeType.includes("document"))
    return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

function getFileColor(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "text-violet-400 bg-violet-500/15";
  if (mimeType.startsWith("video/")) return "text-pink-400 bg-pink-500/15";
  if (mimeType.includes("pdf")) return "text-red-400 bg-red-500/15";
  if (mimeType.includes("zip") || mimeType.includes("rar")) return "text-amber-400 bg-amber-500/15";
  if (mimeType.includes("text") || mimeType.includes("document")) return "text-blue-400 bg-blue-500/15";
  return "text-zinc-400 bg-zinc-700/40";
}

function AttachmentCard({ attachment, onDelete }: { attachment: ModuleAttachment; onDelete: (id: string) => void }) {
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="group bg-zinc-800/60 border border-zinc-700/40 rounded-lg overflow-hidden"
    >
      {isImage && (
        <div className="w-full h-24 bg-zinc-800 overflow-hidden">
          <img
            src={attachment.dataUrl}
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-2.5 p-2.5">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
          <FileTypeIcon mimeType={attachment.type} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-200 truncate">{attachment.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-zinc-500">{formatBytes(attachment.size)}</span>
            <span className="text-[10px] text-zinc-700">·</span>
            <div className="flex items-center gap-1">
              <Avatar className="w-3 h-3">
                <AvatarImage src={uploader?.avatar} />
                <AvatarFallback className="text-[5px] bg-zinc-700">
                  {uploader?.name?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] text-zinc-500">{uploader?.name?.split(" ")[0]}</span>
            </div>
            <span className="text-[10px] text-zinc-700">·</span>
            <span className="text-[10px] text-zinc-500">{formatRelativeTime(attachment.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
            title="Baixar"
          >
            <Download className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(attachment.id)}
            className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Remover"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ModuleAttachmentsPanelProps {
  moduleId: string;
}

export function ModuleAttachmentsPanel({ moduleId }: ModuleAttachmentsPanelProps) {
  const { getAttachmentsByModule, addModuleAttachment, deleteModuleAttachment } = useTaskStore();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);

  const attachments = getAttachmentsByModule(moduleId);

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
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        await addModuleAttachment({
          moduleId,
          userId: user.id,
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl,
        });
        toast.success(`"${file.name}" anexado`);
      } catch {
        toast.error(`Erro ao processar "${file.name}"`);
      } finally {
        setUploading((prev) => prev.filter((n) => n !== file.name));
      }
    },
    [user, moduleId, addModuleAttachment]
  );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(processFile);
  };

  const handleDelete = async (id: string) => {
    await deleteModuleAttachment(id);
    toast.success("Anexo removido");
  };

  return (
    <div className="space-y-3 pt-3 border-t border-zinc-700/40">
      {/* Zona de upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-dashed cursor-pointer transition-all",
          isDragging
            ? "border-violet-500/60 bg-violet-500/10"
            : "border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/30"
        )}
      >
        <Upload className={cn("w-3.5 h-3.5 transition-colors", isDragging ? "text-violet-400" : "text-zinc-500")} />
        <span className="text-xs text-zinc-500">
          {isDragging ? "Solte aqui" : "Clique ou arraste arquivos · máx. 10MB"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          onClick={(e) => (e.currentTarget.value = "")}
        />
      </div>

      {/* Uploads em progresso */}
      <AnimatePresence>
        {uploading.map((name) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50"
          >
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-xs text-zinc-300 truncate flex-1">{name}</p>
            <span className="text-[10px] text-zinc-500 shrink-0">Enviando...</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Lista de anexos */}
      {attachments.length > 0 ? (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
            {attachments.length} anexo{attachments.length !== 1 ? "s" : ""}
          </p>
          <AnimatePresence>
            {attachments.map((att) => (
              <AttachmentCard key={att.id} attachment={att} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        uploading.length === 0 && (
          <div className="flex items-center gap-2 py-2 text-zinc-600">
            <Paperclip className="w-3.5 h-3.5" />
            <span className="text-xs">Nenhum anexo ainda</span>
          </div>
        )
      )}
    </div>
  );
}
