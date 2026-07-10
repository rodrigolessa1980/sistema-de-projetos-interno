"use client";

import { useState, useEffect, useRef } from "react";
import { useProjectStore, useTaskStore, useUserStore } from "@/stores";
import { isQuickLogModule } from "@/lib/worklog";
import { useAuth } from "@/hooks/use-auth";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { motion, AnimatePresence } from "@/lib/motion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft, Clock, Layers,
  Crown, UserPlus, UserMinus, ExternalLink, Link2,
  Plus, Pencil, Trash2, Check, X, Box,
  TrendingUp, Calendar, BarChart3, Target, Eye,
  File, FileText, ImageIcon, Download, MoreVertical,
  ChevronDown, ChevronUp, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import Link from "@/lib/router";
import { notFound, useParams } from "@/lib/router";
import { ReassignPopover } from "@/components/shared/reassign-popover";
import { toast } from "sonner";
import { ModuleDetailDialog } from "@/features/modules/module-detail-dialog";
import { ModuleAttachmentUploadField, type PendingModuleFile } from "@/features/modules/module-attachment-upload-field";
import { api } from "@/lib/api";
import type { ModuleStatus } from "@/types";

interface DevStats {
  userId: string; name: string; avatar: string | null;
  totalHours: number; logCount: number; taskCount: number; avgHoursPerDay: number;
}
interface CalendarDay {
  date: string; totalHours: number;
  developers: { userId: string; name: string; avatar: string | null; hours: number; logs: { taskId: string; taskTitle: string; hours: number; description: string }[] }[];
}
interface ProjectSummary {
  estimatedHours: number; actualHours: number; remainingHours: number;
  progressPercent: number; deviationPercent: number;
  workingDaysConsumed: number; workingDaysEstimated: number;
  developers: DevStats[];
}

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

const MAX_SHOWCASE_FILE_SIZE = 10 * 1024 * 1024;
const MAX_DEMAND_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadDataUrl(dataUrl: string, name: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const showcaseFileInputRef = useRef<HTMLInputElement>(null);
  const demandFileInputRef = useRef<HTMLInputElement>(null);
  const {
    getProjectById,
    getModulesByProject,
    getEpicsByProject,
    getShowcaseAttachmentsByProject,
    fetchProjectShowcaseAttachments,
    updateProjectShowcase,
    addProjectShowcaseAttachment,
    deleteProjectShowcaseAttachment,
    getDemandAttachmentsByProject,
    fetchProjectDemandAttachments,
    updateProjectDemand,
    addProjectDemandAttachment,
    deleteProjectDemandAttachment,
    updateProject,
    addDeveloperToProject,
    removeDeveloperFromProject,
    createModule,
    updateModule,
    deleteModule,
  } = useProjectStore();
  const { getTasksByProject, updateTask, getAttachmentsByModule, fetchTimeLogsForProject, fetchModuleAttachmentsForProject, timeLogs } = useTaskStore();
  const { users } = useUserStore();
  const { user, isAdmin } = useAuth();

  const today = new Date().toISOString().split("T")[0];
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");
  const [newModuleStatus, setNewModuleStatus] = useState<ModuleStatus>("INICIADO");
  const [newModuleHours, setNewModuleHours] = useState("");
  const [newModuleDate, setNewModuleDate] = useState(today);
  const [pendingAttachments, setPendingAttachments] = useState<PendingModuleFile[]>([]);
  const [technicalDraft, setTechnicalDraft] = useState("");
  const [demandDraft, setDemandDraft] = useState("");
  const [editingShowcase, setEditingShowcase] = useState(false);
  const [editingDemand, setEditingDemand] = useState(false);
  const [showcaseDescExpanded, setShowcaseDescExpanded] = useState(false);
  const [demandDescExpanded, setDemandDescExpanded] = useState(false);
  const [previewShowcaseImage, setPreviewShowcaseImage] = useState<{ dataUrl: string; name: string } | null>(null);
  const [previewDemandImage, setPreviewDemandImage] = useState<{ dataUrl: string; name: string } | null>(null);
  const [savingShowcase, setSavingShowcase] = useState(false);
  const [savingDemand, setSavingDemand] = useState(false);
  const [deletingShowcaseFileId, setDeletingShowcaseFileId] = useState<string | null>(null);
  const [deletingDemandFileId, setDeletingDemandFileId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [editingStatus, setEditingStatus] = useState<ModuleStatus>("INICIADO");
  const [addingModule, setAddingModule] = useState(false);
  const [savingModule, setSavingModule] = useState(false);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);

  const projectResult = getProjectById(id);
  if (!projectResult) notFound();
  const project = projectResult;

  const isProjectMember = !!user && (
    project.ownerId === user.id || project.developerIds.includes(user.id)
  );
  const canAddModule = isAdmin || isProjectMember;

  // Recalcula só os agregados computados no servidor (summary/calendar) + timelogs do
  // projeto. NÃO re-baixa blobs de anexo (não mudam ao mexer em módulo). INC-13.
  async function refreshReportAggregates() {
    const [s, c] = await Promise.all([
      api.get<ProjectSummary>(`reports/projects/${id}/summary`).catch(() => null),
      api.get<{ projectId: string; days: CalendarDay[] }>(`reports/projects/${id}/calendar`).catch(() => ({ projectId: id, days: [] })),
    ]);
    if (s) setSummary(s);
    setCalendar(c?.days ?? []);
    await fetchTimeLogsForProject(id);
  }

  async function loadReport() {
    setLoadingReport(true);
    try {
      await refreshReportAggregates();
      // Anexos (blobs pesados) só no carregamento inicial da página.
      await Promise.all([
        fetchModuleAttachmentsForProject(id, getModulesByProject(id).map((m) => m.id)),
        fetchProjectShowcaseAttachments(id),
        fetchProjectDemandAttachments(id),
      ]);
    } finally {
      setLoadingReport(false);
    }
  }

  useEffect(() => {
    void loadReport();
  }, [id]);

  useEffect(() => {
    setTechnicalDraft(project.technicalDescription ?? "");
  }, [project.id, project.technicalDescription]);

  useEffect(() => {
    setDemandDraft(project.demandDescription ?? "");
  }, [project.id, project.demandDescription]);

  useEffect(() => {
    setShowcaseDescExpanded(false);
  }, [id, project.technicalDescription]);

  useEffect(() => {
    setDemandDescExpanded(false);
  }, [id, project.demandDescription]);

  // Só módulos de planejamento; os "andaimes" do lançamento rápido de horas
  // (timesheet) ficam fora da aba Módulos. As horas seguem no relatório (aba Horas).
  const modules = getModulesByProject(id).filter((m) => !isQuickLogModule(m));
  const epics = getEpicsByProject(id);
  const tasks = getTasksByProject(id);
  const showcaseAttachments = getShowcaseAttachmentsByProject(id);
  const demandAttachments = getDemandAttachmentsByProject(id);
  const technicalText = project.technicalDescription?.trim() ?? "";
  const demandText = project.demandDescription?.trim() ?? "";
  const hasTechnicalText = technicalText.length > 0;
  const hasDemandText = demandText.length > 0;

  const owner = users.find((u) => u.id === project.ownerId);
  const devs = users.filter((u) => project.developerIds.includes(u.id));
  const nonMembers = users.filter(
    (u) => !project.developerIds.includes(u.id) && u.id !== project.ownerId
  );

  const tasksByModule = modules.map((mod) => ({
    module: mod,
    tasks: tasks.filter((t) => t.moduleId === mod.id),
    epics: epics.filter((e) => e.moduleId === mod.id),
  }));

  async function handleChangeOwner(userId: string | null) {
    if (!userId) return;
    try {
      await updateProject(id, { ownerId: userId });
      toast.success("Dev que recebeu a demanda atualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o dev responsável.");
    }
  }

  function handleAddMember(userId: string) {
    addDeveloperToProject(id, userId);
    toast.success("Membro adicionado ao projeto");
  }

  function handleRemoveMember(userId: string) {
    removeDeveloperFromProject(id, userId);
    toast.success("Membro removido do projeto");
  }

  function resetModuleForm() {
    setNewModuleName("");
    setNewModuleDesc("");
    setNewModuleStatus("INICIADO");
    setNewModuleHours("");
    setNewModuleDate(today);
    setPendingAttachments([]);
    setAddingModule(false);
  }

  async function handleAddModule() {
    const name = newModuleName.trim();
    if (!name) return;

    const hours = parseFloat(newModuleHours.replace(",", "."));
    if (!newModuleHours.trim() || Number.isNaN(hours) || hours <= 0) {
      toast.error("Informe as horas trabalhadas (valor maior que zero)");
      return;
    }
    if (!newModuleDate) {
      toast.error("Informe a data do trabalho");
      return;
    }
    if (!user) {
      toast.error("Faça login para registrar horas");
      return;
    }

    setSavingModule(true);
    try {
      const existingCount = modules.length;
      const description = newModuleDesc.trim();

      await createModule({
        projectId: id,
        name,
        description,
        status: newModuleStatus,
        order: existingCount,
        hours,
        workDate: newModuleDate,
        attachments: pendingAttachments.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: file.dataUrl,
        })),
      });

      const attachmentCount = pendingAttachments.length;
      resetModuleForm();
      await refreshReportAggregates();
      const attachMsg = attachmentCount > 0
        ? ` e ${attachmentCount} evidência(s) anexada(s)`
        : "";
      toast.success(`Módulo criado com ${hours}h registradas no banco de horas${attachMsg}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar módulo");
    } finally {
      setSavingModule(false);
    }
  }

  async function handleSaveEdit(moduleId: string) {
    if (!editingName.trim()) return;
    setSavingEditId(moduleId);
    try {
      await updateModule(moduleId, { name: editingName.trim(), description: editingDesc.trim(), status: editingStatus });
      setEditingModuleId(null);
      toast.success("Módulo atualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar módulo");
    } finally {
      setSavingEditId(null);
    }
  }

  function startEdit(mod: { id: string; name: string; description: string; status?: ModuleStatus }) {
    setEditingModuleId(mod.id);
    setEditingName(mod.name);
    setEditingDesc(mod.description);
    setEditingStatus(mod.status ?? "INICIADO");
  }

  async function handleDeleteModule(module: { id: string; name: string }) {
    const confirmed = window.confirm(
      `Excluir o módulo "${module.name}"?\n\nEsta ação não pode ser desfeita. Tarefas e horas vinculadas também serão removidas.`,
    );
    if (!confirmed) return;

    setDeletingModuleId(module.id);
    try {
      await deleteModule(module.id);
      if (editingModuleId === module.id) setEditingModuleId(null);
      await refreshReportAggregates();
      toast.success("Módulo excluído");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir módulo");
    } finally {
      setDeletingModuleId(null);
    }
  }

  async function handleSaveShowcase() {
    setSavingShowcase(true);
    try {
      await updateProjectShowcase(id, technicalDraft);
      setEditingShowcase(false);
      toast.success("Demanda salva");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar demanda");
    } finally {
      setSavingShowcase(false);
    }
  }

  function startEditShowcase() {
    setTechnicalDraft(project.technicalDescription ?? "");
    setEditingShowcase(true);
  }

  function cancelEditShowcase() {
    setTechnicalDraft(project.technicalDescription ?? "");
    setEditingShowcase(false);
  }

  async function handleShowcaseFileSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setSavingShowcase(true);
    try {
      for (const file of Array.from(fileList)) {
        if (file.size > MAX_SHOWCASE_FILE_SIZE) {
          toast.error(`"${file.name}" excede o limite de 10MB`);
          continue;
        }
        const dataUrl = await readFileAsDataUrl(file);
        await addProjectShowcaseAttachment(id, {
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl,
        });
      }
      toast.success("Arquivo adicionado à demanda");
      setEditingShowcase(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar arquivo");
    } finally {
      setSavingShowcase(false);
    }
  }

  async function handleDeleteShowcaseFile(attachmentId: string) {
    setDeletingShowcaseFileId(attachmentId);
    try {
      await deleteProjectShowcaseAttachment(attachmentId);
      toast.success("Arquivo removido do projeto");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover arquivo");
    } finally {
      setDeletingShowcaseFileId(null);
    }
  }

  async function handleSaveDemand() {
    setSavingDemand(true);
    try {
      await updateProjectDemand(id, demandDraft);
      setEditingDemand(false);
      toast.success("Demanda salva");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar demanda");
    } finally {
      setSavingDemand(false);
    }
  }

  function startEditDemand() {
    setDemandDraft(project.demandDescription ?? "");
    setEditingDemand(true);
  }

  function cancelEditDemand() {
    setDemandDraft(project.demandDescription ?? "");
    setEditingDemand(false);
  }

  async function handleDemandFileSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setSavingDemand(true);
    try {
      for (const file of Array.from(fileList)) {
        if (file.size > MAX_DEMAND_FILE_SIZE) {
          toast.error(`"${file.name}" excede o limite de 10MB`);
          continue;
        }
        const dataUrl = await readFileAsDataUrl(file);
        await addProjectDemandAttachment(id, {
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl,
        });
      }
      toast.success("Arquivo adicionado à demanda");
      setEditingDemand(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar arquivo");
    } finally {
      setSavingDemand(false);
    }
  }

  async function handleDeleteDemandFile(attachmentId: string) {
    setDeletingDemandFileId(attachmentId);
    try {
      await deleteProjectDemandAttachment(attachmentId);
      toast.success("Arquivo removido da demanda");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao remover arquivo");
    } finally {
      setDeletingDemandFileId(null);
    }
  }

  const selectedModule = selectedModuleId ? modules.find((m) => m.id === selectedModuleId) ?? null : null;
  const selectedModuleTasks = selectedModule ? tasks.filter((t) => t.moduleId === selectedModule.id) : [];

  return (
      <div className="p-6 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/projects" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Projetos
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-300">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <ProjectAvatar name={project.name} color={project.color} avatar={project.avatar} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-zinc-100">{project.name}</h1>
              <Badge className={
                project.status === "ATIVO"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : project.status === "PAUSADO"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-zinc-700 text-zinc-400 border-zinc-600"
              }>
                {project.status}
              </Badge>
            </div>
            <p className="text-sm text-zinc-400 mt-1">{project.description}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{owner?.name ?? "Sem responsável"}</span>
                {isAdmin && (
                  <ReassignPopover
                    currentUserId={project.ownerId}
                    label="Trocar dono"
                    onReassign={handleChangeOwner}
                  />
                )}
              </div>
              {project.testUrl && (
                <a
                  href={/^https?:\/\//i.test(project.testUrl) ? project.testUrl : `https://${project.testUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors group"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="max-w-xs truncate">{project.testUrl}</span>
                </a>
              )}
              {isAdmin && (
                <button
                  onClick={async () => {
                    const raw = prompt("URL de Homologação / Teste:", project.testUrl ?? "");
                    if (raw !== null) {
                      const trimmed = raw.trim();
                      const normalized = trimmed && !/^https?:\/\//i.test(trimmed) ? `https://${trimmed}` : trimmed;
                      try {
                        await updateProject(id, { testUrl: normalized || undefined });
                        toast.success("URL de teste atualizada");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Não foi possível salvar a URL de teste.");
                      }
                    }
                  }}
                  className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  <Link2 className="w-3 h-3" />
                  {project.testUrl ? "Editar URL" : "Adicionar URL de teste"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">Horas</span>
            </div>
            <p className="text-xl font-bold text-zinc-100">
              {summary ? summary.actualHours.toFixed(1) : project.actualHours.toFixed(1)}h
            </p>
            {summary && summary.estimatedHours > 0 && (
              <p className="text-xs text-zinc-500 mt-0.5">
                de {summary.estimatedHours}h estimadas
              </p>
            )}
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500">Tarefas Totais</span>
            </div>
            <p className="text-xl font-bold text-zinc-100">{tasks.length}</p>
          </div>
        </div>

        {/* Demanda */}
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 mb-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-semibold text-zinc-100">Demanda</h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Telas, arquivos e explicações técnicas do que foi implementado neste projeto.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                {showcaseAttachments.length} arquivo{showcaseAttachments.length !== 1 ? "s" : ""}
              </Badge>
              {canAddModule && editingShowcase ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelEditShowcase}
                    disabled={savingShowcase}
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-200"
                    title="Cancelar edição"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveShowcase}
                    disabled={savingShowcase}
                    className="h-8 px-3 text-xs bg-violet-600 hover:bg-violet-700 gap-1"
                  >
                    {savingShowcase ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    {savingShowcase ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : canAddModule ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors outline-none"
                    title="Opções"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700/50 w-44">
                    <DropdownMenuItem
                      onClick={startEditShowcase}
                      className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 gap-2 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar demanda
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </div>

          {editingShowcase && canAddModule ? (
            <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 p-3 space-y-2">
              <label className="text-[11px] text-zinc-500 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Explicação técnica
              </label>
              <textarea
                value={technicalDraft}
                onChange={(e) => setTechnicalDraft(e.target.value)}
                rows={6}
                placeholder="Descreva as telas, regras técnicas, integrações, arquivos alterados e pontos importantes para o usuário entender o projeto."
                className="w-full min-h-[150px] text-sm bg-transparent border-0 px-0 py-1 text-zinc-200 placeholder-zinc-500 outline-none resize-y"
              />
            </div>
          ) : (
            <div className="rounded-lg bg-zinc-950/35 border border-zinc-800/70 overflow-hidden">
              <div
                className={cn(
                  "text-sm whitespace-pre-wrap px-3 pt-3 leading-relaxed",
                  hasTechnicalText ? "text-zinc-300" : "text-zinc-500",
                  !showcaseDescExpanded && hasTechnicalText && "line-clamp-3 pb-1",
                  (showcaseDescExpanded || !hasTechnicalText) && "pb-3",
                )}
              >
                {hasTechnicalText
                  ? technicalText
                  : "Nenhuma explicação técnica adicionada ainda."}
              </div>
              {hasTechnicalText && (
                <button
                  type="button"
                  onClick={() => setShowcaseDescExpanded((prev) => !prev)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-zinc-500 hover:text-violet-400 hover:bg-zinc-800/50 border-t border-zinc-800/70 transition-colors"
                  aria-expanded={showcaseDescExpanded}
                >
                  {showcaseDescExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Recolher explicação
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Ver explicação completa
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          <input
            ref={showcaseFileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.png,.jpg,.jpeg,.webp,.gif"
            className="hidden"
            disabled={!editingShowcase || !canAddModule || savingShowcase}
            onChange={(event) => {
              void handleShowcaseFileSelect(event.target.files);
              event.currentTarget.value = "";
            }}
          />

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {editingShowcase && canAddModule ? (
              [
                ...showcaseAttachments,
                ...Array.from({ length: Math.max(0, 4 - showcaseAttachments.length) }, (_, index) => ({
                  id: `empty-${index}`,
                  empty: true as const,
                })),
              ].map((item) => {
                if ("empty" in item) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => showcaseFileInputRef.current?.click()}
                      disabled={savingShowcase}
                      className="aspect-square rounded-xl border-2 border-dashed border-zinc-700/80 bg-zinc-950/35 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      title="Adicionar imagem ou arquivo"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-xs">Adicionar arquivo</span>
                    </button>
                  );
                }
                const attachment = item;
                const isImage = attachment.type.startsWith("image/");
                return (
                  <div key={attachment.id} className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 overflow-hidden">
                    {isImage ? (
                      <button
                        type="button"
                        onClick={() => setPreviewShowcaseImage({ dataUrl: attachment.dataUrl, name: attachment.name })}
                        className="block w-full aspect-square bg-zinc-900 overflow-hidden cursor-zoom-in"
                        title="Ampliar imagem"
                      >
                        <img src={attachment.dataUrl} alt={attachment.name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform" />
                      </button>
                    ) : (
                      <div className="aspect-square bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <File className="w-8 h-8" />
                      </div>
                    )}
                    <div className="p-3 space-y-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{attachment.name}</p>
                        <p className="text-[10px] text-zinc-500">{formatBytes(attachment.size)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}
                          className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200 gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteShowcaseFile(attachment.id)}
                          disabled={deletingShowcaseFileId === attachment.id}
                          className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : showcaseAttachments.length > 0 ? (
              showcaseAttachments.map((attachment) => {
                const isImage = attachment.type.startsWith("image/");
                return (
                  <div key={attachment.id} className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 overflow-hidden group">
                    {isImage ? (
                      <button
                        type="button"
                        onClick={() => setPreviewShowcaseImage({ dataUrl: attachment.dataUrl, name: attachment.name })}
                        className="block w-full aspect-square bg-zinc-900 overflow-hidden cursor-zoom-in group"
                        title="Ampliar imagem"
                      >
                        <img src={attachment.dataUrl} alt={attachment.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}
                        className="block w-full aspect-square bg-zinc-900 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-violet-300 transition-colors"
                        title="Baixar arquivo"
                      >
                        <File className="w-8 h-8" />
                        <span className="text-[10px] px-2 text-center truncate max-w-full">{attachment.name}</span>
                      </button>
                    )}
                    {isImage && (
                      <div className="px-3 py-2 border-t border-zinc-800/60">
                        <p className="text-[10px] text-zinc-500 truncate">{attachment.name}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-600 italic col-span-full py-2">
                Nenhum arquivo adicionado à demanda.
              </p>
            )}
          </div>
        </div>

        {/* Visual do Projeto */}
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 mb-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-zinc-100">Visual do Projeto</h2>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Documentos, telas e explicações sobre a demanda original deste projeto.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                {demandAttachments.length} arquivo{demandAttachments.length !== 1 ? "s" : ""}
              </Badge>
              {canAddModule && editingDemand ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelEditDemand}
                    disabled={savingDemand}
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-200"
                    title="Cancelar edição"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveDemand}
                    disabled={savingDemand}
                    className="h-8 px-3 text-xs bg-amber-600 hover:bg-amber-700 gap-1"
                  >
                    {savingDemand ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    {savingDemand ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : canAddModule ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors outline-none"
                    title="Opções"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700/50 w-44">
                    <DropdownMenuItem
                      onClick={startEditDemand}
                      className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 gap-2 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar demanda
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </div>

          {editingDemand && canAddModule ? (
            <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 p-3 space-y-2">
              <label className="text-[11px] text-zinc-500 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Explicação técnica
              </label>
              <textarea
                value={demandDraft}
                onChange={(e) => setDemandDraft(e.target.value)}
                rows={6}
                placeholder="Descreva a demanda, requisitos, telas de referência, integrações e pontos importantes para entender o que foi solicitado."
                className="w-full min-h-[150px] text-sm bg-transparent border-0 px-0 py-1 text-zinc-200 placeholder-zinc-500 outline-none resize-y"
              />
            </div>
          ) : (
            <div className="rounded-lg bg-zinc-950/35 border border-zinc-800/70 overflow-hidden">
              <div
                className={cn(
                  "text-sm whitespace-pre-wrap px-3 pt-3 leading-relaxed",
                  hasDemandText ? "text-zinc-300" : "text-zinc-500",
                  !demandDescExpanded && hasDemandText && "line-clamp-3 pb-1",
                  (demandDescExpanded || !hasDemandText) && "pb-3",
                )}
              >
                {hasDemandText
                  ? demandText
                  : "Nenhuma explicação técnica adicionada ainda."}
              </div>
              {hasDemandText && (
                <button
                  type="button"
                  onClick={() => setDemandDescExpanded((prev) => !prev)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/50 border-t border-zinc-800/70 transition-colors"
                  aria-expanded={demandDescExpanded}
                >
                  {demandDescExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Recolher explicação
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Ver explicação completa
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          <input
            ref={demandFileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.png,.jpg,.jpeg,.webp,.gif"
            className="hidden"
            disabled={!editingDemand || !canAddModule || savingDemand}
            onChange={(event) => {
              void handleDemandFileSelect(event.target.files);
              event.currentTarget.value = "";
            }}
          />

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {editingDemand && canAddModule ? (
              [
                ...demandAttachments,
                ...Array.from({ length: Math.max(0, 4 - demandAttachments.length) }, (_, index) => ({
                  id: `empty-demand-${index}`,
                  empty: true as const,
                })),
              ].map((item) => {
                if ("empty" in item) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => demandFileInputRef.current?.click()}
                      disabled={savingDemand}
                      className="aspect-square rounded-xl border-2 border-dashed border-zinc-700/80 bg-zinc-950/35 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-amber-500/50 hover:text-amber-300 hover:bg-amber-500/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      title="Adicionar imagem ou arquivo"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-xs">Adicionar arquivo</span>
                    </button>
                  );
                }
                const attachment = item;
                const isImage = attachment.type.startsWith("image/");
                return (
                  <div key={attachment.id} className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 overflow-hidden">
                    {isImage ? (
                      <button
                        type="button"
                        onClick={() => setPreviewDemandImage({ dataUrl: attachment.dataUrl, name: attachment.name })}
                        className="block w-full aspect-square bg-zinc-900 overflow-hidden cursor-zoom-in"
                        title="Ampliar imagem"
                      >
                        <img src={attachment.dataUrl} alt={attachment.name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform" />
                      </button>
                    ) : (
                      <div className="aspect-square bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <File className="w-8 h-8" />
                      </div>
                    )}
                    <div className="p-3 space-y-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{attachment.name}</p>
                        <p className="text-[10px] text-zinc-500">{formatBytes(attachment.size)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}
                          className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200 gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDemandFile(attachment.id)}
                          disabled={deletingDemandFileId === attachment.id}
                          className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : demandAttachments.length > 0 ? (
              demandAttachments.map((attachment) => {
                const isImage = attachment.type.startsWith("image/");
                return (
                  <div key={attachment.id} className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 overflow-hidden group">
                    {isImage ? (
                      <button
                        type="button"
                        onClick={() => setPreviewDemandImage({ dataUrl: attachment.dataUrl, name: attachment.name })}
                        className="block w-full aspect-square bg-zinc-900 overflow-hidden cursor-zoom-in group"
                        title="Ampliar imagem"
                      >
                        <img src={attachment.dataUrl} alt={attachment.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => downloadDataUrl(attachment.dataUrl, attachment.name)}
                        className="block w-full aspect-square bg-zinc-900 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-amber-300 transition-colors"
                        title="Baixar arquivo"
                      >
                        <File className="w-8 h-8" />
                        <span className="text-[10px] px-2 text-center truncate max-w-full">{attachment.name}</span>
                      </button>
                    )}
                    {isImage && (
                      <div className="px-3 py-2 border-t border-zinc-800/60">
                        <p className="text-[10px] text-zinc-500 truncate">{attachment.name}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-600 italic col-span-full py-2">
                Nenhum arquivo adicionado à demanda.
              </p>
            )}
          </div>
        </div>

        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="modules" className="data-[state=active]:bg-zinc-800">Módulos</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-zinc-800">Tasks</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-zinc-800">
              Equipe ({devs.length + 1})
            </TabsTrigger>
            <TabsTrigger value="hours" className="data-[state=active]:bg-zinc-800">
              <BarChart3 className="w-3.5 h-3.5 mr-1" /> Horas
            </TabsTrigger>
          </TabsList>

          {/* Módulos */}
          <TabsContent value="modules" className="space-y-3">
            {/* Header da aba */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">{modules.length} módulo{modules.length !== 1 ? "s" : ""} neste projeto</p>
              {canAddModule && (
                <Button
                  size="sm"
                  onClick={() => { setAddingModule(true); setEditingModuleId(null); }}
                  className="h-7 px-3 text-xs bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Módulo
                </Button>
              )}
            </div>

            {/* Formulário para adicionar novo módulo */}
            <AnimatePresence>
              {addingModule && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-zinc-900/80 border border-violet-500/30 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Box className="w-4 h-4 text-violet-400" />
                    Novo Módulo
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Registre o trabalho realizado — as horas entram no banco de horas deste projeto para você.
                  </p>
                  <input
                    autoFocus
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="Título..."
                    className="w-full h-8 text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 text-zinc-200 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors"
                  />
                  <textarea
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    placeholder="Observação (opcional)..."
                    rows={2}
                    className="w-full text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
                  />
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Status
                    </label>
                    <Select
                      value={newModuleStatus}
                      onValueChange={(value) => setNewModuleStatus(value as ModuleStatus)}
                    >
                      <SelectTrigger className="h-8 text-sm bg-zinc-800 border-zinc-700 text-zinc-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(moduleStatusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Data
                      </label>
                      <Input
                        type="date"
                        value={newModuleDate}
                        onChange={(e) => setNewModuleDate(e.target.value)}
                        className="h-8 text-sm bg-zinc-800 border-zinc-700 text-zinc-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Horas
                      </label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.25"
                        value={newModuleHours}
                        onChange={(e) => setNewModuleHours(e.target.value)}
                        placeholder="Ex: 2.5"
                        className="h-8 text-sm bg-zinc-800 border-zinc-700 text-zinc-200"
                      />
                    </div>
                  </div>
                  <ModuleAttachmentUploadField
                    files={pendingAttachments}
                    onChange={setPendingAttachments}
                    disabled={savingModule}
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={resetModuleForm} className="h-7 text-xs text-zinc-400" disabled={savingModule}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddModule}
                      disabled={!newModuleName.trim() || !newModuleHours.trim() || savingModule}
                      className="h-7 text-xs bg-violet-600 hover:bg-violet-700 gap-1"
                    >
                      {savingModule ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      {savingModule ? "Salvando..." : "Salvar Módulo"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {modules.length === 0 && !addingModule && (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <Box className="w-10 h-10 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-500 mb-1">Nenhum módulo cadastrado</p>
                <p className="text-xs text-zinc-600">Módulos organizam as funcionalidades do projeto</p>
                {canAddModule && (
                  <Button size="sm" onClick={() => setAddingModule(true)} className="mt-4 h-7 px-3 text-xs bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 gap-1">
                    <Plus className="w-3.5 h-3.5" /> Adicionar primeiro módulo
                  </Button>
                )}
              </div>
            )}

            {tasksByModule.map(({ module, tasks: modTasks }, i) => {
              const modAttachments = getAttachmentsByModule(module.id);
              const modTaskIds = new Set(modTasks.map((t) => t.id));
              const modHours = timeLogs
                .filter((log) => modTaskIds.has(log.taskId))
                .reduce((sum, log) => sum + log.hours, 0);

              return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 group hover:border-vinc-500/30 transition-colors"
              >
                {editingModuleId === module.id ? (
                  /* Modo de edição */
                  <div className="space-y-3">
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(module.id)}
                      className="w-full h-8 text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 text-zinc-200 outline-none focus:border-violet-500/50 transition-colors"
                    />
                    <textarea
                      value={editingDesc}
                      onChange={(e) => setEditingDesc(e.target.value)}
                      placeholder="Descrição..."
                      rows={2}
                      className="w-full text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
                    />
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Status
                      </label>
                      <Select
                        value={editingStatus}
                        onValueChange={(value) => setEditingStatus(value as ModuleStatus)}
                      >
                        <SelectTrigger className="h-8 text-sm bg-zinc-800 border-zinc-700 text-zinc-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(moduleStatusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingModuleId(null)} className="h-7 text-xs text-zinc-400" disabled={savingEditId === module.id}>
                        <X className="w-3.5 h-3.5 mr-1" /> Cancelar
                      </Button>
                      <Button size="sm" onClick={() => handleSaveEdit(module.id)} disabled={!editingName.trim() || savingEditId === module.id} className="h-7 text-xs bg-violet-600 hover:bg-violet-700 gap-1">
                        {savingEditId === module.id ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        {savingEditId === module.id ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Modo de visualização — clique abre detalhes */
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedModuleId(module.id)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedModuleId(module.id)}
                    className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 rounded-lg -m-1 p-1"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-zinc-400">{i + 1}</span>
                        </div>
                        <h3 className="font-semibold text-zinc-100 truncate">{module.name}</h3>
                        <Badge className={`text-[9px] shrink-0 ${moduleStatusClasses[module.status ?? "INICIADO"]}`}>
                          {moduleStatusLabels[module.status ?? "INICIADO"]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="text-sm text-zinc-400">{module.progress}%</span>
                        {canAddModule && (
                          <div className="flex items-center gap-1">
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => startEdit(module)}
                                className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                                title="Editar módulo"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteModule(module)}
                              disabled={deletingModuleId === module.id}
                              className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1"
                            >
                              {deletingModuleId === module.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Excluir
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <Progress value={module.progress} className="h-1.5 bg-zinc-800 mb-3" />
                    {module.description && (
                      <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{module.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        {modHours > 0 && (
                          <span className="text-violet-400/80">{modHours.toFixed(1)}h registradas</span>
                        )}
                        {modAttachments.length > 0 && (
                          <span>{modAttachments.length} anexo{modAttachments.length !== 1 ? "s" : ""}</span>
                        )}
                        <span>{modTasks.length} tarefa{modTasks.length !== 1 ? "s" : ""}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-violet-400/80 group-hover:text-violet-400 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Ver detalhes
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
              );
            })}

            <ModuleDetailDialog
              module={selectedModule}
              tasks={selectedModuleTasks}
              timeLogs={timeLogs}
              attachments={selectedModule ? getAttachmentsByModule(selectedModule.id) : []}
              users={users}
              open={selectedModuleId !== null}
              onOpenChange={(open) => { if (!open) setSelectedModuleId(null); }}
              canUpload={canAddModule}
            />
          </TabsContent>

          {/* Tasks */}
          <TabsContent value="tasks">
            <div className="space-y-2">
              {tasks.map((task) => {
                const assignee = users.find((u) => u.id === task.assigneeId);
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-colors"
                  >
                    <StatusBadge status={task.status} className="text-[10px] shrink-0" />
                    <Link
                      href={`/tasks/${task.id}`}
                      className="flex-1 text-sm text-zinc-200 truncate hover:text-violet-300 transition-colors"
                    >
                      {task.title}
                    </Link>
                    <ComplexityBadge complexity={task.complexity} />

                    {/* Assignee + reatribuição */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={assignee?.avatar} />
                        <AvatarFallback className="text-[9px] bg-zinc-700">
                          {assignee?.name?.slice(0, 2) ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-zinc-400 hidden md:block w-24 truncate">
                        {assignee?.name ?? "Sem resp."}
                      </span>
                      {isAdmin && (
                        <ReassignPopover
                          currentUserId={task.assigneeId}
                          label="Reatribuir"
                          allowClear
                          filterIds={[...project.developerIds, project.ownerId]}
                          onReassign={async (userId) => {
                            try {
                              await updateTask(task.id, { assigneeId: userId ?? undefined });
                              toast.success(userId ? "Task reatribuída" : "Responsável removido");
                            } catch (error) {
                              toast.error(error instanceof Error ? error.message : "Não foi possível reatribuir a task.");
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              {tasks.length === 0 && (
                <p className="text-center text-zinc-500 text-sm py-8">Nenhuma tarefa neste projeto</p>
              )}
            </div>
          </TabsContent>

          {/* Equipe */}
          <TabsContent value="team">
            <div className="space-y-4">
              {/* Dono do projeto */}
              <div>
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Dev que recebeu a demanda
                </p>
                {owner && (
                  <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={owner.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-sm font-bold text-white">
                        {owner.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-100">{owner.name}</p>
                      <p className="text-xs text-zinc-500">{owner.position} · {owner.department}</p>
                    </div>
                    <Badge className="text-[9px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <Crown className="w-2.5 h-2.5 mr-1" /> Demanda
                    </Badge>
                    {isAdmin && (
                      <ReassignPopover
                        currentUserId={project.ownerId}
                        label="Trocar"
                        onReassign={handleChangeOwner}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Desenvolvedores */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Desenvolvedores ({devs.length})
                  </p>
                  {isAdmin && nonMembers.length > 0 && (
                    <ReassignPopover
                      currentUserId={null}
                      label="Adicionar membro"
                      filterIds={nonMembers.map((u) => u.id)}
                      onReassign={(userId) => {
                        if (userId) handleAddMember(userId);
                      }}
                    />
                  )}
                </div>

                <AnimatePresence>
                  {devs.length === 0 && (
                    <p className="text-xs text-zinc-600 italic py-2">Nenhum desenvolvedor alocado</p>
                  )}
                  {devs.map((dev) => {
                    const devTasks = tasks.filter((t) => t.assigneeId === dev.id);
                    const doneTasks = devTasks.filter((t) => t.status === "CONCLUIDA").length;
                    const activeTasks = devTasks.filter((t) => t.status === "EM_DESENVOLVIMENTO").length;

                    return (
                      <motion.div
                        key={dev.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 p-4 bg-zinc-900/60 border border-zinc-800/50 rounded-xl mb-2 hover:border-zinc-700/50 transition-all"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={dev.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
                            {dev.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-100">{dev.name}</p>
                          <p className="text-xs text-zinc-500">{dev.position}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
                          <span>{devTasks.length} tasks</span>
                          {activeTasks > 0 && (
                            <Badge className="text-[9px] bg-violet-500/20 text-violet-400 border-violet-500/30">
                              {activeTasks} ativo(s)
                            </Badge>
                          )}
                          <span className="text-emerald-400">{doneTasks} ✓</span>
                        </div>
                        {isAdmin && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveMember(dev.id)}
                            title="Remover do projeto"
                            className="w-7 h-7 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Adicionar membros disponíveis */}
              {isAdmin && nonMembers.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" /> Disponíveis para alocar
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nonMembers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleAddMember(u.id)}
                        className="flex items-center gap-2.5 p-3 bg-zinc-900/30 border border-zinc-800/40 rounded-xl hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left group"
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage src={u.avatar} />
                          <AvatarFallback className="text-xs bg-zinc-700 text-zinc-300">
                            {u.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-300 truncate">{u.name}</p>
                          <p className="text-[10px] text-zinc-600 truncate">{u.position}</p>
                        </div>
                        <UserPlus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          {/* Horas */}
          <TabsContent value="hours" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">Dados consolidados do backend em tempo real</p>
              <Link
                href={`/reports/projects/${id}`}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Relatório completo →
              </Link>
            </div>
            {loadingReport && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-violet-500/40 border-t-violet-500 rounded-full animate-spin" />
              </div>
            )}

            {!loadingReport && summary && (
              <>
                {/* Cards de estimativa */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Horas estimadas", value: `${summary.estimatedHours}h`, icon: Target, color: "text-zinc-400" },
                    { label: "Horas realizadas", value: `${summary.actualHours.toFixed(1)}h`, icon: Clock, color: "text-violet-400" },
                    { label: "Horas restantes", value: `${summary.remainingHours.toFixed(1)}h`, icon: TrendingUp, color: summary.remainingHours <= 0 ? "text-red-400" : "text-emerald-400" },
                    { label: "Desvio", value: `${summary.deviationPercent}%`, icon: BarChart3, color: summary.deviationPercent > 100 ? "text-red-400" : "text-emerald-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                        <span className="text-xs text-zinc-500">{s.label}</span>
                      </div>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Dias úteis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Dias úteis estimados (÷ 8h)</p>
                    <p className="text-2xl font-bold text-zinc-100">{summary.workingDaysEstimated}</p>
                  </div>
                  <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Dias úteis consumidos (÷ 8h)</p>
                    <p className="text-2xl font-bold text-zinc-100">{summary.workingDaysConsumed}</p>
                  </div>
                </div>

                {/* Ranking de desenvolvedores */}
                {summary.developers.length > 0 && (
                  <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-violet-400" /> Desempenho por Desenvolvedor
                    </h3>
                    <div className="space-y-3">
                      {summary.developers.map((dev, i) => {
                        const pct = summary.actualHours > 0 ? (dev.totalHours / summary.actualHours) * 100 : 0;
                        return (
                          <div key={dev.userId} className="flex items-center gap-3">
                            <span className="text-xs text-zinc-600 w-4">{i + 1}</span>
                            <Avatar className="w-7 h-7 shrink-0">
                              <AvatarFallback className="text-[9px] bg-zinc-700">
                                {dev.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-zinc-300 truncate">{dev.name}</span>
                                <span className="text-xs text-zinc-400 shrink-0 ml-2 font-medium">{dev.totalHours.toFixed(1)}h</span>
                              </div>
                              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-violet-500 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex gap-3 mt-1 text-[10px] text-zinc-600">
                                <span>{dev.taskCount} task{dev.taskCount !== 1 ? "s" : ""}</span>
                                <span>{dev.avgHoursPerDay}h/dia</span>
                                <span>{dev.logCount} registro{dev.logCount !== 1 ? "s" : ""}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Calendário */}
            {!loadingReport && calendar.length > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-400" /> Calendário de Trabalho
                </h3>
                <div className="space-y-3">
                  {calendar.map((day) => (
                    <div key={day.date} className="border border-zinc-800/60 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/40">
                        <span className="text-xs font-medium text-zinc-300">
                          {new Date(day.date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}
                        </span>
                        <span className="text-xs font-bold text-violet-400">{day.totalHours.toFixed(1)}h registradas</span>
                      </div>
                      <div className="divide-y divide-zinc-800/40">
                        {day.developers.map((dev) => (
                          <div key={dev.userId} className="px-4 py-2.5">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-[8px] bg-zinc-700">{dev.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-zinc-300">{dev.name}</span>
                              <span className="text-xs text-zinc-500 ml-auto">{dev.hours.toFixed(1)}h</span>
                            </div>
                            <div className="pl-7 space-y-1">
                              {dev.logs.map((log, li) => (
                                <div key={li} className="text-[11px] text-zinc-500 flex gap-2">
                                  <span className="text-violet-400/70 shrink-0">{log.hours.toFixed(1)}h</span>
                                  <span className="truncate">{log.taskTitle} — {log.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loadingReport && !summary && calendar.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BarChart3 className="w-10 h-10 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-500">Nenhuma hora registrada neste projeto ainda</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog
          open={previewShowcaseImage !== null}
          onOpenChange={(open) => { if (!open) setPreviewShowcaseImage(null); }}
        >
          <DialogContent className="bg-zinc-950 border-zinc-700/50 max-w-5xl w-[min(95vw,900px)] p-3 sm:p-4">
            <DialogTitle className="sr-only">
              {previewShowcaseImage?.name ?? "Visualização da imagem"}
            </DialogTitle>
            {previewShowcaseImage && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400 truncate px-1">{previewShowcaseImage.name}</p>
                <div className="flex items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-800/60 p-2 max-h-[80vh] overflow-auto">
                  <img
                    src={previewShowcaseImage.dataUrl}
                    alt={previewShowcaseImage.name}
                    className="max-w-full max-h-[72vh] w-auto h-auto object-contain rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadDataUrl(previewShowcaseImage.dataUrl, previewShowcaseImage.name)}
                    className="h-8 text-xs text-zinc-400 hover:text-zinc-200 gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPreviewShowcaseImage(null)}
                    className="h-8 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={previewDemandImage !== null}
          onOpenChange={(open) => { if (!open) setPreviewDemandImage(null); }}
        >
          <DialogContent className="bg-zinc-950 border-zinc-700/50 max-w-5xl w-[min(95vw,900px)] p-3 sm:p-4">
            <DialogTitle className="sr-only">
              {previewDemandImage?.name ?? "Visualização da imagem"}
            </DialogTitle>
            {previewDemandImage && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400 truncate px-1">{previewDemandImage.name}</p>
                <div className="flex items-center justify-center rounded-lg bg-zinc-900/80 border border-zinc-800/60 p-2 max-h-[80vh] overflow-auto">
                  <img
                    src={previewDemandImage.dataUrl}
                    alt={previewDemandImage.name}
                    className="max-w-full max-h-[72vh] w-auto h-auto object-contain rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadDataUrl(previewDemandImage.dataUrl, previewDemandImage.name)}
                    className="h-8 text-xs text-zinc-400 hover:text-zinc-200 gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPreviewDemandImage(null)}
                    className="h-8 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
