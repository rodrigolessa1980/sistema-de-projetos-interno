"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/stores/ui-store";
import { useProjectStore, useTaskStore } from "@/stores";
import type { User } from "@/types";
import { CheckSquare, FolderKanban, Check, UserPlus, Pencil, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { CharCounter } from "@/components/shared/char-counter";
import { FIELD_LIMITS } from "@/lib/field-limits";

const schema = z.object({
  name: z.string().max(FIELD_LIMITS.user.name, `O nome deve ter no máximo ${FIELD_LIMITS.user.name} caracteres`).optional(),
  email: z.string().max(FIELD_LIMITS.user.email, `O email deve ter no máximo ${FIELD_LIMITS.user.email} caracteres`).optional(),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "DEVELOPER"]).optional(),
  position: z.string().max(FIELD_LIMITS.user.position, `O cargo deve ter no máximo ${FIELD_LIMITS.user.position} caracteres`).optional(),
  department: z.string().max(FIELD_LIMITS.user.department, `O departamento deve ter no máximo ${FIELD_LIMITS.user.department} caracteres`).optional(),
});

type FormValues = z.infer<typeof schema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editUser?: User | null;
}

export function UserDialog(props: UserDialogProps) {
  const formKey = `${props.open ? "open" : "closed"}-${props.editUser?.id ?? "new"}-${props.editUser?.updatedAt ?? ""}`;
  return <UserDialogForm {...props} key={formKey} />;
}

function UserDialogForm({ open, onOpenChange, editUser }: UserDialogProps) {
  const { createUser, createUserRemote, updateUser } = useUserStore();
  const { projects, addDeveloperToProject, removeDeveloperFromProject } = useProjectStore();
  const { tasks, updateTask } = useTaskStore();

  const [selectedProjects, setSelectedProjects] = useState<string[]>(() => editUser?.projectIds ?? []);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editUser
      ? {
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
          position: editUser.position,
          department: editUser.department,
        }
      : {
          name: "",
          email: "",
          password: "",
          role: "DEVELOPER",
          position: "",
          department: "",
        },
  });

  const availableTasks = tasks.filter((t) =>
    selectedProjects.includes(t.projectId) && !t.assigneeId
  );

  function toggleProject(id: string) {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    setError(null);
    try {
      let userId: string;
      const timestamp = Date.now();
      const normalizedValues = {
        name: values.name?.trim() || `Usuario ${new Date().toLocaleString("pt-BR")}`,
        email: values.email?.trim() || `usuario-${timestamp}@devflow.local`,
        password: values.password?.trim() || "",
        role: values.role ?? "DEVELOPER",
        position: values.position?.trim() || "Nao informado",
        department: values.department?.trim() || "Nao informado",
      };

      if (isEditing && editUser) {
        // Persiste papel/dados no backend (agora async).
        await updateUser(editUser.id, { ...normalizedValues, projectIds: selectedProjects });
        userId = editUser.id;

        const prevProjects = editUser.projectIds ?? [];
        const added = selectedProjects.filter((p) => !prevProjects.includes(p));
        const removed = prevProjects.filter((p) => !selectedProjects.includes(p));
        added.forEach((pId) => addDeveloperToProject(pId, userId));
        removed.forEach((pId) => removeDeveloperFromProject(pId, userId));
      } else {
        if (normalizedValues.password) {
          // Cria a conta DE VERDADE no grupo do admin, com o papel escolhido.
          const created = await createUserRemote({
            name: normalizedValues.name,
            email: normalizedValues.email,
            password: normalizedValues.password,
            position: normalizedValues.position,
            department: normalizedValues.department,
            role: normalizedValues.role,
          });
          userId = created.id;
        } else {
          const user = createUser({ ...normalizedValues, projectIds: selectedProjects, avatar: undefined });
          userId = user.id;
        }
        selectedProjects.forEach((pId) => addDeveloperToProject(pId, userId));
      }

      if (selectedTaskId) {
        await updateTask(selectedTaskId, { assigneeId: userId });
      }

      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar usuário.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center gap-2">
            {isEditing ? <Pencil className="w-4 h-4 text-violet-400" /> : <UserPlus className="w-4 h-4 text-violet-400" />}
            {isEditing ? "Editar Usuário" : "Criar Novo Usuário"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Dados pessoais */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Dados Pessoais</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-zinc-400 text-xs">Nome completo</FormLabel>
                    <CharCounter value={field.value} max={FIELD_LIMITS.user.name} />
                  </div>
                  <FormControl>
                    <Input {...field} maxLength={FIELD_LIMITS.user.name} placeholder="Ex: João Silva" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-zinc-400 text-xs">E-mail</FormLabel>
                    <CharCounter value={field.value} max={FIELD_LIMITS.user.email} />
                  </div>
                  <FormControl>
                    <Input {...field} type="email" maxLength={FIELD_LIMITS.user.email} placeholder="joao@empresa.com" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              </div>

              {!isEditing && (
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs">Senha (para acesso ao sistema)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          maxLength={FIELD_LIMITS.user.passwordMax}
                          placeholder="Mínimo 6 caracteres"
                          className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-zinc-400 text-xs">Cargo</FormLabel>
                      <CharCounter value={field.value} max={FIELD_LIMITS.user.position} />
                    </div>
                    <FormControl>
                      <Input {...field} maxLength={FIELD_LIMITS.user.position} placeholder="Ex: Dev Frontend" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-zinc-400 text-xs">Departamento</FormLabel>
                      <CharCounter value={field.value} max={FIELD_LIMITS.user.department} />
                    </div>
                    <FormControl>
                      <Input {...field} maxLength={FIELD_LIMITS.user.department} placeholder="Ex: Engenharia" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs">Papel no sistema</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: "DEVELOPER", title: "Developer", desc: "Acesso padrão" },
                      { value: "ADMIN", title: "Administrador", desc: "Acesso total" },
                    ] as const).map((opt) => {
                      const active = field.value === opt.value;
                      const isAdmin = opt.value === "ADMIN";
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition-all",
                            active
                              ? isAdmin
                                ? "border-amber-500/60 bg-amber-500/10"
                                : "border-violet-500/60 bg-violet-500/10"
                              : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-600"
                          )}
                        >
                          <span className="flex items-center gap-1.5 text-sm font-semibold">
                            <span className={cn(
                              "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0",
                              active
                                ? isAdmin ? "border-amber-400 bg-amber-400" : "border-violet-400 bg-violet-400"
                                : "border-zinc-600"
                            )}>
                              {active && <Check className="w-2 h-2 text-zinc-950" />}
                            </span>
                            <span className={cn(active ? (isAdmin ? "text-amber-300" : "text-violet-300") : "text-zinc-300")}>
                              {opt.title}
                            </span>
                          </span>
                          <span className="text-[11px] text-zinc-500 pl-5">{opt.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {/* Alocação em Projetos */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5" /> Alocar em Projetos
              </p>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {projects.map((proj) => {
                  const selected = selectedProjects.includes(proj.id);
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => toggleProject(proj.id)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all text-sm",
                        selected
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded flex items-center justify-center border shrink-0",
                        selected ? "bg-violet-500 border-violet-500" : "border-zinc-600"
                      )}>
                        {selected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="truncate">{proj.name}</span>
                      <Badge className="ml-auto text-[9px] shrink-0 bg-zinc-800 text-zinc-400 border-zinc-700">
                        {proj.status}
                      </Badge>
                    </button>
                  );
                })}
              </div>
              {selectedProjects.length > 0 && (
                <p className="text-[11px] text-zinc-500">
                  {selectedProjects.length} projeto(s) selecionado(s)
                </p>
              )}
            </div>

            {/* Atribuição de Task */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" /> Atribuir a uma Tarefa (opcional)
              </p>
              {availableTasks.length === 0 ? (
                <p className="text-xs text-zinc-600 italic py-1">
                  {selectedProjects.length === 0
                    ? "Selecione projetos para ver tarefas disponíveis"
                    : "Sem tarefas sem responsável nos projetos selecionados"}
                </p>
              ) : (
                <Select value={selectedTaskId} items={availableTasks.map((t) => ({ value: t.id, label: t.title }))} onValueChange={(value) => setSelectedTaskId(value ?? "")}>
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-zinc-300 text-sm">
                    <SelectValue placeholder="Selecionar tarefa..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 max-h-48">
                    <SelectItem value="" className="text-zinc-500 focus:bg-zinc-800 text-xs">Nenhuma</SelectItem>
                    {availableTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id} className="text-zinc-200 focus:bg-zinc-800 text-sm">
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isSaving ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
