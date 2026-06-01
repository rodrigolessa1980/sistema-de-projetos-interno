"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { useProjectStore, useTaskStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { ProjectStatus } from "@/types";
import { z } from "zod";

const statusColors: Record<ProjectStatus, string> = {
  ATIVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSADO: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CONCLUIDO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CANCELADO: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
  NA_FILA: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const epicSchema = z.object({
  projectId: z.string().min(1, "Selecione um projeto"),
  moduleId: z.string().min(1, "Selecione um modulo"),
  name: z.string().min(3, "Minimo 3 caracteres"),
  description: z.string().min(10, "Minimo 10 caracteres"),
  startDate: z.string().min(1, "Data obrigatoria"),
  endDate: z.string().min(1, "Prazo obrigatorio"),
});

type EpicForm = z.infer<typeof epicSchema>;

export default function EpicsPage() {
  const { epics, projects, modules, createEpic } = useProjectStore();
  const { tasks } = useTaskStore();
  const { isAdmin } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const form = useForm<EpicForm>({
    resolver: zodResolver(epicSchema),
    defaultValues: {
      projectId: "",
      moduleId: "",
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
  });
  const projectId = useWatch({ control: form.control, name: "projectId" });
  const filteredModules = modules.filter((module) => module.projectId === projectId);

  const openCreateDialog = () => {
    form.reset({
      projectId: "",
      moduleId: "",
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    });
    setIsCreateOpen(true);
  };

  const handleCreate = async (data: EpicForm) => {
    await createEpic({ ...data, status: "ATIVO", progress: 0 });
    toast.success("Epic criado com sucesso");
    setIsCreateOpen(false);
    form.reset();
  };

  return (
    <AppLayout>
      <PageHeader
        title="Epics"
        description={`${epics.length} epics em andamento`}
        actions={isAdmin ? [{ label: "Novo Epic", onClick: openCreateDialog }] : undefined}
      />
      <div className="p-6">
        {epics.length === 0 ? (
          <EmptyState icon={Layers} title="Nenhum epic" description="Os epics serão exibidos aqui." />
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const projectEpics = epics.filter((e) => e.projectId === project.id);
              if (projectEpics.length === 0) return null;
              return (
                <div key={project.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                    <h2 className="text-sm font-semibold text-zinc-300">{project.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projectEpics.map((epic, i) => {
                      const projectModule = modules.find((m) => m.id === epic.moduleId);
                      const epicTasks = tasks.filter((t) => t.epicId === epic.id);
                      return (
                        <motion.div
                          key={epic.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-sm font-semibold text-zinc-100">{epic.name}</h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${statusColors[epic.status]}`}>
                              {epic.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{epic.description}</p>
                            {projectModule && (
                              <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded mb-3 inline-block">{projectModule.name}</span>
                          )}
                          <Progress value={epic.progress} className="h-1.5 bg-zinc-800 mb-2" />
                          <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>{epic.progress}% concluído</span>
                            <span>{epicTasks.length} tarefa{epicTasks.length !== 1 ? "s" : ""} · {formatDate(epic.startDate)} – {formatDate(epic.endDate)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Epic</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="projectId" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Projeto</Label>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => {
                        field.onChange(value ?? "");
                        form.setValue("moduleId", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700/50">
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id} label={project.name}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="moduleId" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Modulo</Label>
                    <Select value={field.value || undefined} onValueChange={(value) => field.onChange(value ?? "")} disabled={!projectId}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700/50">
                        {filteredModules.map((module) => (
                          <SelectItem key={module.id} value={module.id} label={module.name}>{module.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Nome</Label>
                  <FormControl>
                    <Input {...field} placeholder="Nome do epic" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Descricao</Label>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Objetivo e escopo do epic" className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Inicio</Label>
                    <FormControl>
                      <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Prazo</Label>
                    <FormControl>
                      <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-zinc-400">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                  Criar Epic
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
