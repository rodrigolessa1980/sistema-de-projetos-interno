"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { ALL_STATUSES, getStatusLabel, COMPLEXITY_OPTIONS, getComplexityLabel } from "@/lib/utils";
import type { TaskComplexity, TaskStatus } from "@/types";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(5, "Mínimo 5 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  projectId: z.string().min(1, "Selecione um projeto"),
  moduleId: z.string().min(1, "Selecione um módulo"),
  epicId: z.string().min(1, "Selecione um epic"),
  assigneeId: z.string().min(1, "Selecione um responsável"),
  status: z.enum(["BACKLOG", "PLANEJADA", "BLOQUEADA", "EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA", "CANCELADA"] as const),
  complexity: z.number(),
  estimatedHours: z.number().min(0.5),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskCreateDialog({ open, onOpenChange }: Props) {
  const { createTask } = useTaskStore();
  const { projects, modules, epics } = useProjectStore();
  const { users } = useUserStore();
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", description: "", projectId: "", moduleId: "", epicId: "",
      assigneeId: "", status: "BACKLOG", complexity: 3, estimatedHours: 8,
    },
  });

  const projectId = form.watch("projectId");
  const moduleId = form.watch("moduleId");
  const filteredModules = modules.filter((m) => m.projectId === projectId);
  const filteredEpics = epics.filter((e) => e.moduleId === moduleId);

  const onSubmit = async (data: FormData) => {
    await createTask({
      ...data,
      complexity: data.complexity as TaskComplexity,
      status: data.status as TaskStatus,
      reporterId: user?.id ?? "",
      actualHours: 0,
      dependencyIds: [],
      tags: [],
      order: 0,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Nova Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Título</Label>
                <FormControl>
                  <Input {...field} placeholder="Título da task" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Descrição</Label>
                <FormControl>
                  <Textarea {...field} placeholder="Descreva o que precisa ser feito..." className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="projectId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Projeto</Label>
                  <Select onValueChange={(v) => { field.onChange(v); form.setValue("moduleId", ""); form.setValue("epicId", ""); }}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="moduleId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Módulo</Label>
                  <Select onValueChange={(v) => { field.onChange(v); form.setValue("epicId", ""); }} disabled={!projectId}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {filteredModules.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="epicId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Epic</Label>
                  <Select onValueChange={field.onChange} disabled={!moduleId}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {filteredEpics.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="assigneeId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Responsável</Label>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Status</Label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="complexity" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Complexidade</Label>
                  <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {COMPLEXITY_OPTIONS.map((c) => <SelectItem key={c} value={String(c)}>{c} - {getComplexityLabel(c)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="estimatedHours" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Horas Est.</Label>
                  <FormControl>
                    <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="dueDate" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Prazo (opcional)</Label>
                <FormControl>
                  <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400">Cancelar</Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700">Criar Task</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
