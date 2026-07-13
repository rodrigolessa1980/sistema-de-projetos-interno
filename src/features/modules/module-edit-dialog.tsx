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
import { useProjectStore } from "@/stores";
import type { Module, ModuleStatus } from "@/types";
import { toast } from "sonner";
import { CharCounter } from "@/components/shared/char-counter";
import { FIELD_LIMITS } from "@/lib/field-limits";

const MODULE_STATUS_OPTIONS: { value: ModuleStatus; label: string }[] = [
  { value: "INICIADO", label: "Iniciado" },
  { value: "EM_PROCESSO", label: "Em processo" },
  { value: "CONCLUIDO", label: "Concluído" },
];

const schema = z.object({
  name: z.string().max(FIELD_LIMITS.module.name, `O nome deve ter no máximo ${FIELD_LIMITS.module.name} caracteres`).optional(),
  description: z.string().max(FIELD_LIMITS.module.description, `A descrição deve ter no máximo ${FIELD_LIMITS.module.description} caracteres`).optional(),
  status: z.enum(["INICIADO", "EM_PROCESSO", "CONCLUIDO"] as const).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  module: Module;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModuleEditDialog({ module, open, onOpenChange }: Props) {
  const { updateModule } = useProjectStore();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: module.name,
      description: module.description,
      status: module.status,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ name: module.name, description: module.description, status: module.status });
  }, [open, module, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateModule(module.id, {
        name: data.name?.trim() || module.name,
        description: data.description ?? "",
        status: (data.status ?? module.status) as ModuleStatus,
      });
      toast.success("Módulo atualizado");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o módulo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Editar Módulo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm">Nome</Label>
                  <CharCounter value={field.value} max={FIELD_LIMITS.module.name} />
                </div>
                <FormControl>
                  <Input {...field} maxLength={FIELD_LIMITS.module.name} placeholder="Nome do módulo" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm">Descrição</Label>
                  <CharCounter value={field.value} max={FIELD_LIMITS.module.description} />
                </div>
                <FormControl>
                  <Textarea {...field} maxLength={FIELD_LIMITS.module.description} placeholder="Descreva o módulo..." className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Status</Label>
                <Select value={field.value ?? module.status} items={MODULE_STATUS_OPTIONS} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-900 border-zinc-700/50">
                    {MODULE_STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
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
