"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useProjectStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { useUserStore } from "@/stores";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Users, Calendar, TrendingUp, MoreVertical, Edit, Trash2, Eye, Crown, UserCog, ImagePlus, X, Link2, ExternalLink, Box, GripVertical, ListOrdered, Flag, Building2 } from "lucide-react";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import type { ProjectStatus } from "@/types";
import type { Project } from "@/types";
import { ReassignPopover } from "@/components/shared/reassign-popover";

const projectColors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

const statusLabels: Record<ProjectStatus, string> = {
  ATIVO: "Ativo",
  PAUSADO: "Pausado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  NA_FILA: "Na Fila",
};

const statusColors: Record<ProjectStatus, string> = {
  ATIVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSADO: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CONCLUIDO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CANCELADO: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
  NA_FILA: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const createProjectSchema = z.object({
  companyId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  requestedBy: z.string().optional(),
  ownerId: z.string().optional(),
  status: z.enum(["ATIVO", "PAUSADO", "CONCLUIDO", "CANCELADO", "NA_FILA"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  color: z.string().optional(),
  testUrl: z.string().optional(),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

type ModuleDraft = { id: string; name: string; description: string };

export default function ProjectsPage() {
  const { projects, companies, createProject, deleteProject, updateProject, addDeveloperToProject, removeDeveloperFromProject, createModulesBulk } = useProjectStore();
  const { users } = useUserStore();
  const { user, isAdmin } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [moduleDrafts, setModuleDrafts] = useState<ModuleDraft[]>([]);
  const [newModuleName, setNewModuleName] = useState("");

  const visibleProjects = isAdmin ? projects : projects.filter((p) => p.developerIds.includes(user?.id ?? "") || p.ownerId === user?.id);

  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      companyId: "",
      name: "", description: "", status: "ATIVO",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      estimatedHours: 160, color: projectColors[0], testUrl: "",
    },
  });

  const editForm = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      companyId: "",
      name: "",
      description: "",
      requestedBy: "",
      ownerId: "",
      status: "ATIVO",
      startDate: "",
      endDate: "",
      estimatedHours: 0,
      color: projectColors[0],
      testUrl: "",
    },
  });

  const watchedName = form.watch("name");
  const watchedColor = form.watch("color");

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleOpenCreate() {
    setAvatarPreview(null);
    setModuleDrafts([]);
    setNewModuleName("");
    form.reset({
      companyId: "",
      name: "", description: "", requestedBy: "", ownerId: "", status: "ATIVO",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      estimatedHours: 160, color: projectColors[0], testUrl: "",
    });
    setIsCreateOpen(true);
  }

  function handleOpenEdit(project: Project) {
    setEditingProject(project);
    editForm.reset({
      companyId: project.companyId ?? "",
      name: project.name,
      description: project.description,
      requestedBy: project.requestedBy ?? "",
      ownerId: project.ownerId,
      status: project.status,
      startDate: project.startDate.split("T")[0],
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      estimatedHours: project.estimatedHours,
      color: project.color,
      testUrl: project.testUrl ?? "",
    });
  }

  async function handleDeleteProject(project: Project) {
    const confirmed = window.confirm(
      `Excluir o projeto "${project.name}"?\n\nEsta ação remove módulos, tarefas, anexos e horas vinculadas.`
    );
    if (!confirmed) return;
    await deleteProject(project.id);
    toast.success("Projeto removido");
  }

  function addModuleDraft() {
    const name = newModuleName.trim();
    if (!name) return;
    setModuleDrafts((prev) => [...prev, { id: `draft-${Date.now()}`, name, description: "" }]);
    setNewModuleName("");
  }

  function removeModuleDraft(id: string) {
    setModuleDrafts((prev) => prev.filter((m) => m.id !== id));
  }

  function updateModuleDraftDesc(id: string, description: string) {
    setModuleDrafts((prev) => prev.map((m) => m.id === id ? { ...m, description } : m));
  }

  const onSubmit = async (data: CreateProjectForm) => {
    const fallbackName = `Projeto ${new Date().toLocaleString("pt-BR")}`;
    const startDate = data.startDate || new Date().toISOString().split("T")[0];
    const newProject = await createProject({
      ...data,
      name: data.name?.trim() || fallbackName,
      description: data.description?.trim() || "Projeto criado sem descricao.",
      requestedBy: data.requestedBy?.trim() || undefined,
      status: data.status ?? "ATIVO",
      companyId: data.companyId || undefined,
      ownerId: user?.id ?? "",
      developerIds: [],
      actualHours: 0,
      progress: 0,
      estimatedHours: data.estimatedHours ?? 0,
      avatar: avatarPreview ?? undefined,
      color: data.color || projectColors[0],
      startDate,
      testUrl: data.testUrl || undefined,
      endDate: data.endDate || null,
    });
    if (moduleDrafts.length > 0) {
      await createModulesBulk(newProject.id, moduleDrafts.map((m) => ({ name: m.name, description: m.description })));
    }
    toast.success(`Projeto criado com ${moduleDrafts.length > 0 ? `${moduleDrafts.length} módulo(s)` : "sucesso"}!`);
    setIsCreateOpen(false);
    setAvatarPreview(null);
    setModuleDrafts([]);
    setNewModuleName("");
    form.reset();
  };

  const onEditSubmit = async (data: CreateProjectForm) => {
    if (!editingProject) return;
    await updateProject(editingProject.id, {
      companyId: data.companyId || null,
      name: data.name?.trim() || editingProject.name,
      description: data.description?.trim() || "",
      requestedBy: data.requestedBy?.trim() || null,
      ownerId: data.ownerId || editingProject.ownerId,
      status: data.status ?? editingProject.status,
      startDate: data.startDate || editingProject.startDate.split("T")[0],
      endDate: data.endDate || undefined,
      estimatedHours: data.estimatedHours ?? editingProject.estimatedHours,
      color: data.color || editingProject.color,
      testUrl: data.testUrl || null,
    });
    setEditingProject(null);
    toast.success("Projeto atualizado");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Projetos"
        description={`${visibleProjects.length} projeto${visibleProjects.length !== 1 ? "s" : ""} encontrado${visibleProjects.length !== 1 ? "s" : ""}`}
        actions={isAdmin ? [{ label: "Novo Projeto", onClick: handleOpenCreate }] : undefined}
      />

      <div className="p-6 w-full">
        {visibleProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="Nenhum projeto encontrado"
            description="Crie seu primeiro projeto para começar a gerenciar o desenvolvimento da sua equipe."
            action={isAdmin ? { label: "Criar Projeto", onClick: handleOpenCreate } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleProjects.map((project, i) => {
              const devs = users.filter((u) => project.developerIds.includes(u.id));
              const owner = users.find((u) => u.id === project.ownerId);
              const nonMembers = users.filter((u) => !project.developerIds.includes(u.id) && u.id !== project.ownerId);
              const company = companies.find((c) => c.id === project.companyId);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 cursor-pointer hover:border-zinc-700/50 transition-all hover:shadow-lg hover:shadow-black/20"
                >
                  <Link
                    href={`/projects/${project.id}`}
                    aria-label={`Abrir detalhes do projeto ${project.name}`}
                    className="absolute inset-0 z-[1] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ProjectAvatar name={project.name} color={project.color} avatar={project.avatar} size="md" />
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white">{project.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusColors[project.status]}`}>
                            {statusLabels[project.status]}
                          </span>
                          {project.queueOrder != null && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                              <ListOrdered className="w-2.5 h-2.5" />#{project.queueOrder}
                            </span>
                          )}
                        </div>
                        {company && (
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border"
                              style={{
                                background: `${company.color}18`,
                                color: company.color,
                                borderColor: `${company.color}35`,
                              }}
                            >
                              <Building2 className="w-2.5 h-2.5" />
                              {company.shortName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<button className="relative z-10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-zinc-700 text-zinc-400 transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>}
                      />
                      <DropdownMenuContent className="bg-zinc-900 border-zinc-700/50 w-52">
                        <DropdownMenuItem
                          render={<Link href={`/projects/${project.id}`} className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" /> Ver detalhes
                          </Link>}
                        />
                        {isAdmin && (
                          <>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-zinc-300 focus:bg-zinc-800"
                              onClick={() => handleOpenEdit(project)}
                            >
                              <Edit className="w-3.5 h-3.5" /> Editar projeto
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-zinc-300 focus:bg-zinc-800"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                              <span className="flex-1">Trocar responsável</span>
                              <ReassignPopover
                                currentUserId={project.ownerId}
                                label=""
                                onReassign={async (userId) => {
                                  if (!userId) return;
                                  await updateProject(project.id, { ownerId: userId });
                                  toast.success("Responsável atualizado");
                                }}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-zinc-300 focus:bg-zinc-800"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <UserCog className="w-3.5 h-3.5 text-violet-400" />
                              <span className="flex-1">Adicionar membro</span>
                              <ReassignPopover
                                currentUserId={null}
                                label=""
                                filterIds={nonMembers.map((u) => u.id)}
                                onReassign={(userId) => {
                                  if (!userId) return;
                                  addDeveloperToProject(project.id, userId);
                                  toast.success("Membro adicionado");
                                }}
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-400 focus:text-red-400 focus:bg-red-500/10"
                              onClick={() => handleDeleteProject(project)}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                  {project.requestedBy && (
                    <p className="text-[11px] text-zinc-500 mb-3">
                      Solicitado por <span className="text-zinc-300">{project.requestedBy}</span>
                    </p>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-zinc-500">Progresso</span>
                      <span className="text-xs font-semibold text-zinc-300">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5 bg-zinc-800" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(project.startDate)}
                    </div>
                    <div className="flex -space-x-1.5">
                      {devs.slice(0, 4).map((dev) => (
                        <Avatar key={dev.id} className="w-5 h-5 border border-zinc-900">
                          <AvatarImage src={dev.avatar} />
                          <AvatarFallback className="text-[8px] bg-zinc-700">{dev.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {devs.length > 4 && (
                        <div className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-900 flex items-center justify-center text-[8px] text-zinc-300">
                          +{devs.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {project.testUrl && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/50">
                      <a
                        href={/^https?:\/\//i.test(project.testUrl) ? project.testUrl : `https://${project.testUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors truncate group"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{project.testUrl.replace(/^https?:\/\//, "")}</span>
                      </a>
                    </div>
                  )}

                  <div className={`flex items-center justify-between text-xs ${project.testUrl ? "mt-2" : "mt-3 pt-3 border-t border-zinc-800/50"}`}>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Crown className="w-3 h-3 text-amber-400/70" />
                      <span className="truncate max-w-[100px]">{owner?.name ?? "—"}</span>
                    </div>
                    <Link href={`/projects/${project.id}`} className="relative z-10 text-violet-400 hover:text-violet-300 flex items-center gap-1">
                      Abrir <TrendingUp className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Projeto</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Avatar do projeto */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <ProjectAvatar
                    name={watchedName || "PR"}
                    color={watchedColor || projectColors[0]}
                    avatar={avatarPreview ?? undefined}
                    size="xl"
                  />
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setAvatarPreview(null)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <Label className="text-zinc-300 text-sm block mb-1.5">Imagem do Projeto</Label>
                  <label className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500/50 hover:bg-zinc-800/80 transition-all group">
                    <ImagePlus className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      {avatarPreview ? "Trocar imagem" : "Clique para fazer upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG ou WEBP · máx. 2MB</p>
                </div>
              </div>

              {/* Empresa do grupo */}
              <FormField control={form.control} name="companyId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    Empresa do Grupo
                  </Label>
                  <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectValue placeholder="Nenhuma (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="__none__" label="Nenhuma" className="text-zinc-500 focus:bg-zinc-700">
                        Nenhuma
                      </SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id} label={company.name} className="text-zinc-100 focus:bg-zinc-700">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ background: company.color }}
                            />
                            {company.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Nome</Label>
                  <FormControl>
                    <Input {...field} placeholder="Nome do projeto" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Descrição</Label>
                  <FormControl>
                    <Textarea {...field} placeholder="Descrição do projeto" className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {/* Prazo de entrega — define posição na fila */}
              <FormField control={form.control} name="requestedBy" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Solicitado por</Label>
                  <FormControl>
                    <Input {...field} placeholder="Nome de quem solicitou" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    Prazo de Entrega
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                      define posição na fila
                    </span>
                  </Label>
                  <FormControl>
                    <Input {...field} type="date" className="bg-zinc-800 border-amber-500/30 text-zinc-100 focus-visible:ring-amber-500/40" />
                  </FormControl>
                  <p className="text-[11px] text-zinc-500 -mt-1">
                    Projetos com prazo mais próximo ficam no topo da fila de desenvolvimento.
                  </p>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Data de Início</Label>
                    <FormControl>
                      <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="estimatedHours" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Horas Estimadas</Label>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="color" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">
                    Cor de destaque {avatarPreview && <span className="text-zinc-500 font-normal">(usada como fallback)</span>}
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {projectColors.map((c) => (
                      <button
                        key={c} type="button"
                        onClick={() => field.onChange(c)}
                        className={`w-7 h-7 rounded-lg transition-all ${field.value === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </FormItem>
              )} />

              <FormField control={form.control} name="testUrl" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-zinc-500" />
                    URL de Homologação / Teste
                    <span className="text-zinc-600 font-normal">(opcional)</span>
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                      <Input
                        {...field}
                        placeholder="https://staging.meuapp.com"
                        className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-9"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Módulos do projeto */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-zinc-500" />
                    Módulos
                    {moduleDrafts.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-semibold">
                        {moduleDrafts.length}
                      </span>
                    )}
                  </Label>
                  <span className="text-[10px] text-zinc-600">Opcional — pode adicionar depois</span>
                </div>

                {/* Lista de módulos adicionados */}
                {moduleDrafts.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {moduleDrafts.map((mod, idx) => (
                      <div key={mod.id} className="bg-zinc-800/60 border border-zinc-700/50 rounded-lg p-2.5 group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-5 h-5 rounded-md bg-zinc-700 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-zinc-400">{idx + 1}</span>
                          </div>
                          <span className="text-xs font-medium text-zinc-200 flex-1 truncate">{mod.name}</span>
                          <button
                            type="button"
                            onClick={() => removeModuleDraft(mod.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-500 hover:text-red-400 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          value={mod.description}
                          onChange={(e) => updateModuleDraftDesc(mod.id, e.target.value)}
                          placeholder="Descrição do módulo (opcional)..."
                          className="w-full text-[11px] bg-transparent text-zinc-400 placeholder-zinc-600 outline-none border-b border-zinc-700/50 focus:border-violet-500/50 pb-0.5 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Input para adicionar novo módulo */}
                <div className="flex gap-2">
                  <input
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addModuleDraft(); } }}
                    placeholder="Ex: Autenticação, Painel Admin, API..."
                    className="flex-1 h-8 text-xs bg-zinc-800 border border-zinc-700 rounded-md px-3 text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addModuleDraft}
                    disabled={!newModuleName.trim()}
                    className="h-8 px-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 gap-1 text-xs disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-zinc-400">Cancelar</Button>
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                  Criar Projeto{moduleDrafts.length > 0 ? ` + ${moduleDrafts.length} módulo${moduleDrafts.length > 1 ? "s" : ""}` : ""}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingProject} onOpenChange={(open) => { if (!open) setEditingProject(null); }}>
        <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Editar Projeto</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField control={editForm.control} name="companyId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    Empresa do Grupo
                  </Label>
                  <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectValue placeholder="Nenhuma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="__none__" label="Nenhuma" className="text-zinc-500 focus:bg-zinc-700">
                        Nenhuma
                      </SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id} label={company.name} className="text-zinc-100 focus:bg-zinc-700">
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={editForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Título</Label>
                  <FormControl>
                    <Input {...field} placeholder="Nome do projeto" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={editForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Explicação</Label>
                  <FormControl>
                    <Textarea {...field} placeholder="Explique o projeto" className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={editForm.control} name="requestedBy" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Quem fez a solicitação</Label>
                  <FormControl>
                    <Input {...field} placeholder="Nome do solicitante" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={editForm.control} name="ownerId" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Responsável</Label>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Responsável" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {users.map((item) => (
                          <SelectItem key={item.id} value={item.id} label={item.name} className="text-zinc-100 focus:bg-zinc-700">
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={editForm.control} name="status" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Status</Label>
                    <Select value={field.value ?? "ATIVO"} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value} label={label} className="text-zinc-100 focus:bg-zinc-700">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField control={editForm.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Data de Início</Label>
                    <FormControl>
                      <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="endDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Prazo</Label>
                    <FormControl>
                      <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField control={editForm.control} name="estimatedHours" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Horas Estimadas</Label>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="testUrl" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">URL de teste</Label>
                    <FormControl>
                      <Input {...field} placeholder="https://..." className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={editForm.control} name="color" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Cor de destaque</Label>
                  <div className="flex gap-2 flex-wrap">
                    {projectColors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => field.onChange(c)}
                        className={`w-7 h-7 rounded-lg transition-all ${field.value === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </FormItem>
              )} />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setEditingProject(null)} className="text-zinc-400">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                  Salvar alterações
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
