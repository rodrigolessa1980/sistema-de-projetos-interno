"use client";

import { useEffect } from "react";
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
import { useTaskStore } from "@/stores";
import { ALL_STATUSES, getStatusLabel, COMPLEXITY_OPTIONS } from "@/lib/utils";
import type { Task, TaskComplexity, TaskStatus } from "@/types";
import { toast } from "sonner";
import { CharCounter } from "@/components/shared/char-counter";
import { FIELD_LIMITS } from "@/lib/field-limits";

const COMPLEXITY_DESCRIPTIONS: Record<number, string> = {
  1: "Muito simples",
  2: "Simples",
  3: "Média",
  5: "Complexa",
  8: "Muito complexa",
};

const schema = z.object({
  title: z.string().max(FIELD_LIMITS.task.title, `O título deve ter no máximo ${FIELD_LIMITS.task.title} caracteres`).optional(),
  description: z.string().max(FIELD_LIMITS.task.description, `A descrição deve ter no máximo ${FIELD_LIMITS.task.description} caracteres`).optional(),
  status: z.enum(["BACKLOG", "PLANEJADA", "BLOQUEADA", "EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA", "CANCELADA"] as const).optional(),
  complexity: z.number().optional(),
  estimatedHours: z.number().optional(),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toDateInput(value?: string | null): string {
  if (!value) return "";
  return value.split("T")[0];
}

export function TaskEditDialog({ task, open, onOpenChange }: Props) {
  const { updateTask } = useTaskStore();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      complexity: task.complexity,
      estimatedHours: task.estimatedHours,
      dueDate: toDateInput(task.dueDate),
    },
  });

  // Repõe os valores quando reabre para outra tarefa (ou após editar).
  useEffect(() => {
    if (!open) return;
    form.reset({
      title: task.title,
      description: task.description,
      status: task.status,
      complexity: task.complexity,
      estimatedHours: task.estimatedHours,
      dueDate: toDateInput(task.dueDate),
    });
  }, [open, task, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateTask(task.id, {
        title: data.title?.trim() || task.title,
        description: data.description ?? "",
        status: (data.status ?? task.status) as TaskStatus,
        complexity: (data.complexity ?? task.complexity) as TaskComplexity,
        estimatedHours: data.estimatedHours ?? task.estimatedHours,
        dueDate: data.dueDate?.trim() || undefined,
      });
      toast.success("Tarefa atualizada");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a tarefa.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Editar Tarefa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm">Título</Label>
                  <CharCounter value={field.value} max={FIELD_LIMITS.task.title} />
                </div>
                <FormControl>
                  <Input {...field} maxLength={FIELD_LIMITS.task.title} placeholder="Título da tarefa" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm">Descrição</Label>
                  <CharCounter value={field.value} max={FIELD_LIMITS.task.description} />
                </div>
                <FormControl>
                  <Textarea {...field} maxLength={FIELD_LIMITS.task.description} placeholder="Descreva o que precisa ser feito..." className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Status</Label>
                  <Select value={field.value ?? task.status} items={ALL_STATUSES.map((s) => ({ value: s, label: getStatusLabel(s) }))} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
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
                  <Select value={String(field.value ?? task.complexity)} items={COMPLEXITY_OPTIONS.map((c) => ({ value: String(c), label: `${c} · ${COMPLEXITY_DESCRIPTIONS[c]}` }))} onValueChange={(v) => field.onChange(Number(v))}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {COMPLEXITY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={String(c)} label={`${c} · ${COMPLEXITY_DESCRIPTIONS[c]}`}>
                          <span className="font-semibold tabular-nums">{c}</span>
                          <span className="text-zinc-400">· {COMPLEXITY_DESCRIPTIONS[c]}</span>
                        </SelectItem>
                      ))}
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
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60">
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
