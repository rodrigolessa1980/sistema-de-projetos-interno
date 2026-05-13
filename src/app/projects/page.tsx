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
import { FolderKanban, Plus, Users, Calendar, TrendingUp, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
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

const projectColors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

const statusLabels: Record<ProjectStatus, string> = {
  ATIVO: "Ativo",
  PAUSADO: "Pausado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

const statusColors: Record<ProjectStatus, string> = {
  ATIVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSADO: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CONCLUIDO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CANCELADO: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
};

const createProjectSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  status: z.enum(["ATIVO", "PAUSADO", "CONCLUIDO", "CANCELADO"]),
  startDate: z.string().min(1, "Data obrigatória"),
  endDate: z.string().optional(),
  estimatedHours: z.number().min(1),
  color: z.string(),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export default function ProjectsPage() {
  const { projects, createProject, deleteProject } = useProjectStore();
  const { users } = useUserStore();
  const { user, isAdmin } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const visibleProjects = isAdmin ? projects : projects.filter((p) => p.developerIds.includes(user?.id ?? "") || p.ownerId === user?.id);

  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "", description: "", status: "ATIVO",
      startDate: new Date().toISOString().split("T")[0],
      estimatedHours: 160, color: projectColors[0],
    },
  });

  const onSubmit = async (data: CreateProjectForm) => {
    await createProject({
      ...data,
      ownerId: user?.id ?? "",
      developerIds: [],
      actualHours: 0,
      progress: 0,
      estimatedHours: data.estimatedHours,
    });
    toast.success("Projeto criado com sucesso!");
    setIsCreateOpen(false);
    form.reset();
  };

  return (
    <AppLayout>
      <PageHeader
        title="Projetos"
        description={`${visibleProjects.length} projeto${visibleProjects.length !== 1 ? "s" : ""} encontrado${visibleProjects.length !== 1 ? "s" : ""}`}
        actions={isAdmin ? [{ label: "Novo Projeto", onClick: () => setIsCreateOpen(true) }] : undefined}
      />

      <div className="p-6">
        {visibleProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="Nenhum projeto encontrado"
            description="Crie seu primeiro projeto para começar a gerenciar o desenvolvimento da sua equipe."
            action={isAdmin ? { label: "Criar Projeto", onClick: () => setIsCreateOpen(true) } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleProjects.map((project, i) => {
              const devs = users.filter((u) => project.developerIds.includes(u.id));
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/50 transition-all hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: project.color }}>
                        {project.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white">{project.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border mt-0.5 ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-zinc-700 text-zinc-400 transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-900 border-zinc-700/50">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}`} className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" /> Ver detalhes
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuItem className="flex items-center gap-2 text-zinc-300">
                              <Edit className="w-3.5 h-3.5" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-400 focus:text-red-400 focus:bg-red-500/10"
                              onClick={() => { deleteProject(project.id); toast.success("Projeto removido"); }}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>

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

                  <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">{project.actualHours}h / {project.estimatedHours}h</span>
                    <Link href={`/projects/${project.id}`} className="text-violet-400 hover:text-violet-300 flex items-center gap-1">
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
        <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Projeto</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Início</Label>
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
                  <Label className="text-zinc-300 text-sm">Cor</Label>
                  <div className="flex gap-2">
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
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-zinc-400">Cancelar</Button>
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700">Criar Projeto</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
