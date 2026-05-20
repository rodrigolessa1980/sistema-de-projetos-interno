"use client";

import { use, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useProjectStore, useTaskStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft, Clock, CheckCircle2, AlertTriangle, Layers,
  Crown, UserPlus, UserMinus, ShieldCheck, RefreshCw, ExternalLink, Link2,
  Plus, Pencil, Trash2, Check, X, Box,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReassignPopover } from "@/components/shared/reassign-popover";
import { toast } from "sonner";
import type { User } from "@/types";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getProjectById, getModulesByProject, getEpicsByProject, updateProject, addDeveloperToProject, removeDeveloperFromProject, createModule, updateModule, deleteModule } = useProjectStore();
  const { getTasksByProject, updateTask } = useTaskStore();
  const { users } = useUserStore();
  const { isAdmin } = useAuth();

  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [addingModule, setAddingModule] = useState(false);

  const project = getProjectById(id);
  if (!project) notFound();

  const modules = getModulesByProject(id);
  const epics = getEpicsByProject(id);
  const tasks = getTasksByProject(id);

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
    await updateProject(id, { ownerId: userId });
    toast.success("Responsável do projeto atualizado");
  }

  function handleAddMember(userId: string) {
    addDeveloperToProject(id, userId);
    toast.success("Membro adicionado ao projeto");
  }

  function handleRemoveMember(userId: string) {
    removeDeveloperFromProject(id, userId);
    toast.success("Membro removido do projeto");
  }

  async function handleAddModule() {
    const name = newModuleName.trim();
    if (!name) return;
    const existingCount = modules.length;
    await createModule({ projectId: id, name, description: newModuleDesc.trim(), order: existingCount, progress: 0 });
    setNewModuleName("");
    setNewModuleDesc("");
    setAddingModule(false);
    toast.success("Módulo adicionado");
  }

  async function handleSaveEdit(moduleId: string) {
    if (!editingName.trim()) return;
    await updateModule(moduleId, { name: editingName.trim(), description: editingDesc.trim() });
    setEditingModuleId(null);
    toast.success("Módulo atualizado");
  }

  function startEdit(mod: { id: string; name: string; description: string }) {
    setEditingModuleId(mod.id);
    setEditingName(mod.name);
    setEditingDesc(mod.description);
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
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
                  href={project.testUrl}
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
                  onClick={() => {
                    const url = prompt("URL de Homologação / Teste:", project.testUrl ?? "");
                    if (url !== null) updateProject(id, { testUrl: url.trim() || undefined });
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Progresso", value: `${project.progress}%`, icon: CheckCircle2 },
            { label: "Horas Gastas", value: `${project.actualHours}h`, icon: Clock },
            { label: "Tarefas Totais", value: tasks.length, icon: Layers },
            { label: "Bloqueadas", value: tasks.filter((t) => t.status === "BLOQUEADA").length, icon: AlertTriangle },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-zinc-500" />
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-zinc-100">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="modules" className="data-[state=active]:bg-zinc-800">Módulos</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-zinc-800">Tasks</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-zinc-800">
              Equipe ({devs.length + 1})
            </TabsTrigger>
          </TabsList>

          {/* Módulos */}
          <TabsContent value="modules" className="space-y-3">
            {/* Header da aba */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">{modules.length} módulo{modules.length !== 1 ? "s" : ""} neste projeto</p>
              {isAdmin && (
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
                  <input
                    autoFocus
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
                    placeholder="Nome do módulo..."
                    className="w-full h-8 text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 text-zinc-200 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors"
                  />
                  <textarea
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    placeholder="Descrição (opcional)..."
                    rows={2}
                    className="w-full text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setAddingModule(false); setNewModuleName(""); setNewModuleDesc(""); }} className="h-7 text-xs text-zinc-400">
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleAddModule} disabled={!newModuleName.trim()} className="h-7 text-xs bg-violet-600 hover:bg-violet-700 gap-1">
                      <Check className="w-3.5 h-3.5" /> Salvar Módulo
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
                {isAdmin && (
                  <Button size="sm" onClick={() => setAddingModule(true)} className="mt-4 h-7 px-3 text-xs bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 gap-1">
                    <Plus className="w-3.5 h-3.5" /> Adicionar primeiro módulo
                  </Button>
                )}
              </div>
            )}

            {tasksByModule.map(({ module, tasks: modTasks, epics: modEpics }, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 group"
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
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingModuleId(null)} className="h-7 text-xs text-zinc-400">
                        <X className="w-3.5 h-3.5 mr-1" /> Cancelar
                      </Button>
                      <Button size="sm" onClick={() => handleSaveEdit(module.id)} className="h-7 text-xs bg-violet-600 hover:bg-violet-700 gap-1">
                        <Check className="w-3.5 h-3.5" /> Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Modo de visualização */
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-zinc-400">{i + 1}</span>
                        </div>
                        <h3 className="font-semibold text-zinc-100">{module.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">{module.progress}%</span>
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(module)}
                              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { deleteModule(module.id); toast.success("Módulo removido"); }}
                              className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <Progress value={module.progress} className="h-1.5 bg-zinc-800 mb-3" />
                    {module.description && (
                      <p className="text-xs text-zinc-500 mb-3">{module.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>{modEpics.length} épico{modEpics.length !== 1 ? "s" : ""}</span>
                      <span>{modTasks.length} tarefa{modTasks.length !== 1 ? "s" : ""}</span>
                      <span>{modTasks.filter((t) => t.status === "CONCLUIDA").length} concluída{modTasks.filter((t) => t.status === "CONCLUIDA").length !== 1 ? "s" : ""}</span>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
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
                            await updateTask(task.id, { assigneeId: userId ?? undefined });
                            toast.success(userId ? "Task reatribuída" : "Responsável removido");
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
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Responsável pelo Projeto
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
                      <Crown className="w-2.5 h-2.5 mr-1" /> Dono
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
        </Tabs>
      </div>
    </AppLayout>
  );
}
