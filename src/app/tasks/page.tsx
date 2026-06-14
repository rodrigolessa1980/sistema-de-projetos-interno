"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useTaskStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { TaskCreateDialog } from "@/features/tasks/task-create-dialog";
import { TasksListView } from "@/features/tasks/tasks-list-view";

export default function TasksPage() {
  const { tasks } = useTaskStore();
  const { user, isAdmin } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openCount = useMemo(() => {
    return tasks.filter((t) => {
      if (!isAdmin && t.assigneeId !== user?.id) return false;
      return !["CONCLUIDA", "CANCELADA"].includes(t.status);
    }).length;
  }, [tasks, isAdmin, user]);

  return (
    <>
      <PageHeader
        title="Tarefas"
        description={`${openCount} aberta${openCount !== 1 ? "s" : ""} · organize por categoria, projeto ou status`}
        actions={isAdmin ? [{ label: "Nova Tarefa", onClick: () => setIsCreateOpen(true) }] : undefined}
      />

      <div className="p-6 w-full">
        <TasksListView
          isAdmin={isAdmin}
          userId={user?.id}
          onCreateTask={isAdmin ? () => setIsCreateOpen(true) : undefined}
        />
      </div>

      {isAdmin && <TaskCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />}
    </>
  );
}
