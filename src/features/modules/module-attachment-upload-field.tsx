"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, FileImage, FileText, File, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export interface PendingModuleFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface Props {
  files: PendingModuleFile[];
  onChange: (files: PendingModuleFile[]) => void;
  disabled?: boolean;
}

export function ModuleAttachmentUploadField({ files, onChange, disabled }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState<string[]>([]);

  const processFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      const incoming = Array.from(fileList);
      const next: PendingModuleFile[] = [...files];

      for (const file of incoming) {
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`"${file.name}" excede o limite de ${MAX_SIZE_MB}MB`);
          continue;
        }
        if (next.some((f) => f.name === file.name && f.size === file.size)) {
          toast.error(`"${file.name}" já foi adicionado`);
          continue;
        }

        setProcessing((prev) => [...prev, file.name]);
        try {
          const dataUrl = await readFileAsDataUrl(file);
          next.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            dataUrl,
          });
        } catch {
          toast.error(`Erro ao processar "${file.name}"`);
        } finally {
          setProcessing((prev) => prev.filter((n) => n !== file.name));
        }
      }

      onChange(next);
    },
    [files, onChange, disabled],
  );

  const removeFile = (id: string) => {
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] text-zinc-500 flex items-center gap-1">
        <Paperclip className="w-3 h-3" /> Evidências (imagens e arquivos)
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          void processFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          "flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-dashed transition-all",
          disabled ? "opacity-50 cursor-not-allowed border-zinc-800" : "cursor-pointer",
          isDragging
            ? "border-violet-500/60 bg-violet-500/10"
            : "border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/30",
        )}
      >
        <Upload className={cn("w-3.5 h-3.5", isDragging ? "text-violet-400" : "text-zinc-500")} />
        <span className="text-xs text-zinc-500">
          {isDragging ? "Solte os arquivos aqui" : "Clique ou arraste imagens e arquivos do PC · máx. 10MB"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.png,.jpg,.jpeg,.webp,.gif"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            void processFiles(e.target.files);
            e.currentTarget.value = "";
          }}
        />
      </div>

      <AnimatePresence>
        {processing.map((name) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50"
          >
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-xs text-zinc-300 truncate flex-1">{name}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {files.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-zinc-600">
            {files.length} arquivo{files.length !== 1 ? "s" : ""} selecionado{files.length !== 1 ? "s" : ""}
          </p>
          <AnimatePresence>
            {files.map((file) => {
              const isImage = file.type.startsWith("image/");
              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/40 group"
                >
                  {isImage ? (
                    <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-zinc-800">
                      <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-zinc-700/40 text-zinc-400">
                      {file.type.includes("pdf") || file.type.includes("text") ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <File className="w-4 h-4" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-zinc-500">{formatBytes(file.size)}</p>
                  </div>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                      className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
