"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { useUserStore } from "@/stores/ui-store";
import { useTaskStore, useProjectStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, Briefcase, UserPlus, Pencil, Trash2,
  AlertTriangle, ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { UserDialog } from "@/features/users/user-dialog";
import type { User } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function UsersPage() {
  const { users, deleteUser } = useUserStore();
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { isAdmin, user: me } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  if (!isAdmin) return (
    <AppLayout>
      <EmptyState icon={Users} title="Acesso Restrito" description="Apenas administradores podem gerenciar usuários." />
    </AppLayout>
  );

  function handleEdit(u: User) {
    setEditUser(u);
    setDialogOpen(true);
  }

  function handleCreate() {
    setEditUser(null);
    setDialogOpen(true);
  }

  function handleDelete() {
    if (confirmDelete) {
      deleteUser(confirmDelete.id);
      setConfirmDelete(null);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Gestão de Usuários"
        description={`${users.length} usuário${users.length !== 1 ? "s" : ""} cadastrado${users.length !== 1 ? "s" : ""}`}
        actions={
          <Button onClick={handleCreate} className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5">
            <UserPlus className="w-4 h-4" />
            Novo Usuário
          </Button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {users.map((u, i) => {
              const userTasks = tasks.filter((t) => t.assigneeId === u.id);
              const completedTasks = userTasks.filter((t) => t.status === "CONCLUIDA");
              const userProjects = projects.filter(
                (p) => p.developerIds.includes(u.id) || p.ownerId === u.id
              );
              const totalHours = timeLogs
                .filter((tl) => tl.userId === u.id)
                .reduce((acc, tl) => acc + tl.hours, 0);
              const completionRate =
                userTasks.length > 0
                  ? Math.round((completedTasks.length / userTasks.length) * 100)
                  : 0;
              const isSelf = u.id === me?.id;

              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/50 transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
                          {u.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-zinc-100">{u.name}</p>
                          {isSelf && (
                            <Badge className="text-[9px] bg-blue-500/20 text-blue-400 border-blue-500/30 px-1 py-0">
                              Você
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">{u.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Badge
                        className={
                          u.role === "ADMIN"
                            ? "bg-violet-500/20 text-violet-400 border-violet-500/30 text-[10px]"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]"
                        }
                      >
                        {u.role === "ADMIN" ? (
                          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin</span>
                        ) : "Developer"}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    {u.department}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: "Projetos", value: userProjects.length },
                      { label: "Tarefas", value: userTasks.length },
                      { label: "Horas", value: `${totalHours}h` },
                    ].map((s) => (
                      <div key={s.label} className="bg-zinc-800/60 rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-zinc-200">{s.value}</p>
                        <p className="text-[10px] text-zinc-500">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-zinc-500">Taxa de conclusão</span>
                      <span className="text-xs font-semibold text-zinc-300">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-1.5 bg-zinc-800" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-zinc-800/50">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(u)}
                      className="flex-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(u)}
                      disabled={isSelf}
                      className="flex-1 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 gap-1.5 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editUser={editUser}
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Remover usuário
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-400">
            Tem certeza que deseja remover{" "}
            <span className="text-zinc-200 font-semibold">{confirmDelete?.name}</span>?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(null)} className="text-zinc-400">
              Cancelar
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
