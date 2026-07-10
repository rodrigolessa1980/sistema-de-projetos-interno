"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "@/lib/router";
import Link from "@/lib/router";
import { useProjectStore, useTaskStore, useUserStore } from "@/stores";
import { PageLoading } from "@/components/shared/page-loading";
import { ExpandableText } from "@/components/shared/expandable-text";
import { StatusBadge } from "@/components/shared/task-badge";
import { TaskCreateDialog } from "@/features/tasks/task-create-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Box, Calendar, Clock, User2, MessageSquare, Paperclip,
  Plus, ListTodo, ChevronRight, Download, FileText, FileImage, File as FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ModuleStatus, ModuleAttachment } from "@/types";

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
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function AttachmentCard({ attachment }: { attachment: ModuleAttachment }) {
  const isImage = attachment.type.startsWith("image/");
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
        <div className="w-full max-h-48 bg-zinc-800 overflow-hidden">
          <img src={attachment.dataUrl} alt={attachment.name} className="w-full h-full object-contain max-h-48" />
        </div>
      )}
      <div className="flex items-center gap-2.5 p-3 min-w-0">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isImage ? "text-violet-400 bg-violet-500/15" : "text-zinc-400 bg-zinc-700/40")}>
          {isImage ? <FileImage className="w-4 h-4" /> : attachment.type.includes("pdf") ? <FileText className="w-4 h-4" /> : <FileIcon className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-200 truncate">{attachment.name}</p>
          <p className="text-[10px] text-zinc-500">{formatBytes(attachment.size)}</p>
        </div>
        <button type="button" onClick={handleDownload} className="p-1.5 rounded text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors shrink-0" title="Baixar">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { modules, projects } = useProjectStore();
  const hasLoaded = useProjectStore((s) => s.hasLoaded);
  const { tasks, timeLogs, getAttachmentsByModule, fetchModuleAttachmentsForProject } = useTaskStore();
  const { users } = useUserStore();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const projectModule = modules.find((m) => m.id === id) ?? null;
  const project = projectModule ? projects.find((p) => p.id === projectModule.projectId) : null;

  // Carrega (lazy) os anexos do projeto para exibir as evidências deste módulo.
  useEffect(() => {
    if (!projectModule) return;
    const projectId = projectModule.projectId;
    const moduleIds = modules.filter((m) => m.projectId === projectId).map((m) => m.id);
    void fetchModuleAttachmentsForProject(projectId, moduleIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectModule?.id]);

  const moduleTasks = useMemo(
    () => (projectModule ? tasks.filter((t) => t.moduleId === projectModule.id) : []),
    [tasks, projectModule?.id],
  );

  const moduleLogs = useMemo(() => {
    if (!projectModule) return [];
    const taskIds = new Set(moduleTasks.map((t) => t.id));
    return timeLogs.filter((l) => taskIds.has(l.taskId));
  }, [timeLogs, moduleTasks, projectModule?.id]);

  if (!hasLoaded) {
    return <div className="p-6 w-full"><PageLoading label="Carregando módulo..." /></div>;
  }

  if (!projectModule) {
    return (
      <div className="p-6 w-full">
        <Link href="/modules" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar para Módulos
        </Link>
        <EmptyState icon={Box} title="Módulo não encontrado" description="Ele pode ter sido removido ou o link está incorreto." />
      </div>
    );
  }

  const status = projectModule.status ?? "INICIADO";
  const attachments = getAttachmentsByModule(projectModule.id);
  const totalHours = moduleLogs.length > 0
    ? moduleLogs.reduce((sum, l) => sum + l.hours, 0)
    : (projectModule.loggedHours ?? 0);
  const workDate = moduleLogs[0]?.date ?? projectModule.workDate ?? projectModule.createdAt.split("T")[0];
  const responsibleId = moduleLogs[0]?.userId ?? projectModule.loggedByUserId;
  const responsible = responsibleId ? users.find((u) => u.id === responsibleId) : null;
  const completedTasks = moduleTasks.filter((t) => t.status === "CONCLUIDA").length;

  return (
    <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto">
      {/* Navegação + título */}
      <Link href="/modules" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar para Módulos
      </Link>

      <div className="flex items-start gap-3 mb-2 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
          <Box className="w-5 h-5 text-violet-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-zinc-100 break-words">{projectModule.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge className={`text-[10px] border ${moduleStatusClasses[status]}`}>{moduleStatusLabels[status]}</Badge>
            {project && (
              <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-violet-300 transition-colors">
                <ProjectAvatar name={project.name} color={project.color} avatar={project.avatar} size="xs" />
                <span className="truncate max-w-[200px]">{project.name}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* O que é um módulo */}
      <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
        Um módulo é uma atividade de um setor deste projeto — reúne a descrição do trabalho, as horas
        registradas e as tarefas relacionadas.
      </p>

      {/* Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1"><Calendar className="w-3 h-3" /> Data do trabalho</div>
          <p className="text-xs font-medium text-zinc-200">{formatDate(workDate)}</p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1"><Clock className="w-3 h-3" /> Horas registradas</div>
          <p className="text-xs font-medium text-violet-300">{totalHours > 0 ? `${totalHours.toFixed(1)}h` : "—"}</p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1"><ListTodo className="w-3 h-3" /> Progresso</div>
          <p className="text-xs font-medium text-zinc-200">{projectModule.progress}% · {completedTasks}/{moduleTasks.length} tarefas</p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1"><User2 className="w-3 h-3" /> Responsável</div>
          {responsible ? (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="w-5 h-5 shrink-0">
                <AvatarImage src={responsible.avatar} />
                <AvatarFallback className="text-[8px] bg-zinc-700">{responsible.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium text-zinc-200 truncate">{responsible.name}</p>
            </div>
          ) : <p className="text-xs text-zinc-500">—</p>}
        </div>
      </div>

      {/* Descrição / observação */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-2"><MessageSquare className="w-3.5 h-3.5" /> Descrição do módulo</h2>
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-3">
          <ExpandableText text={projectModule.description} collapsedLines={8} emptyFallback="Nenhuma descrição registrada." />
        </div>
      </section>

      {/* Tarefas */}
      <section className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <h2 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><ListTodo className="w-3.5 h-3.5" /> Tarefas ({moduleTasks.length})</h2>
          <Button size="sm" onClick={() => setTaskDialogOpen(true)} className="bg-violet-600 hover:bg-violet-700 gap-1.5 h-7">
            <Plus className="w-3.5 h-3.5" /> Adicionar tarefa
          </Button>
        </div>
        {moduleTasks.length === 0 ? (
          <div className="bg-zinc-800/30 border border-dashed border-zinc-700/50 rounded-lg py-8 text-center">
            <p className="text-sm text-zinc-500">Nenhuma tarefa neste módulo ainda.</p>
            <p className="text-xs text-zinc-600 mt-1">Clique em “Adicionar tarefa” para começar.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {moduleTasks.map((task) => {
              const assignee = users.find((u) => u.id === task.assigneeId);
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="group flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-lg hover:border-violet-500/30 transition-all hover:shadow-blue-glow-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate group-hover:text-white">{task.title}</p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{task.description}</p>
                  </div>
                  <StatusBadge status={task.status} />
                  {assignee && (
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarImage src={assignee.avatar} />
                      <AvatarFallback className="text-[9px] bg-zinc-700">{assignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Evidências / anexos */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-2"><Paperclip className="w-3.5 h-3.5" /> Evidências ({attachments.length})</h2>
        {attachments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attachments.map((att) => <AttachmentCard key={att.id} attachment={att} />)}
          </div>
        ) : (
          <p className="text-xs text-zinc-600 italic py-2">Nenhum arquivo anexado a este módulo.</p>
        )}
      </section>

      <TaskCreateDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        defaultProjectId={projectModule.projectId}
        defaultModuleId={projectModule.id}
      />
    </div>
  );
}
