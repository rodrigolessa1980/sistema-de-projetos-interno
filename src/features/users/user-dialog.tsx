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
import { useProjectStore } from "@/stores";
import { useTaskStore } from "@/stores";
import type { User } from "@/types";
import { CheckSquare, FolderKanban, X, Check, UserPlus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["ADMIN", "DEVELOPER"]),
  position: z.string().min(2, "Cargo obrigatório"),
  department: z.string().min(2, "Departamento obrigatório"),
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
  const { createUser, updateUser } = useUserStore();
  const { projects, addDeveloperToProject, removeDeveloperFromProject } = useProjectStore();
  const { tasks, updateTask } = useTaskStore();

  const [selectedProjects, setSelectedProjects] = useState<string[]>(() => editUser?.projectIds ?? []);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

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
    try {
      let userId: string;

      if (isEditing && editUser) {
        updateUser(editUser.id, { ...values, projectIds: selectedProjects });
        userId = editUser.id;

        // Sync project membership
        const prevProjects = editUser.projectIds ?? [];
        const added = selectedProjects.filter((p) => !prevProjects.includes(p));
        const removed = prevProjects.filter((p) => !selectedProjects.includes(p));
        added.forEach((pId) => addDeveloperToProject(pId, userId));
        removed.forEach((pId) => removeDeveloperFromProject(pId, userId));
      } else {
        const user = createUser({ ...values, projectIds: selectedProjects, avatar: undefined });
        userId = user.id;
        selectedProjects.forEach((pId) => addDeveloperToProject(pId, userId));
      }

      if (selectedTaskId) {
        await updateTask(selectedTaskId, { assigneeId: userId });
      }

      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 max-w-lg max-h-[90vh] overflow-y-auto">
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

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs">Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: João Silva" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs">E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="joao@empresa.com" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs">Cargo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Dev Frontend" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs">Departamento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Engenharia" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-violet-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs">Papel no sistema</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-100">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="DEVELOPER" className="text-zinc-200 focus:bg-zinc-800">Developer</SelectItem>
                      <SelectItem value="ADMIN" className="text-zinc-200 focus:bg-zinc-800">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

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
                <Select value={selectedTaskId} onValueChange={(value) => setSelectedTaskId(value ?? "")}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-zinc-300 text-sm">
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
