"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";
import { useSyncWorkSession } from "@/hooks/use-work-session";
import { useRouter, usePathname } from "@/lib/router";
import { useEffect } from "react";
import { useProjectStore, useTaskStore, useUIStore, useUserStore } from "@/stores";
import { preloadMainPages } from "@/lib/page-loaders";
import { AwaitingApproval } from "@/components/auth/awaiting-approval";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const { isAuthenticated, isLoading, session, logout } = useAuth();
  // Fonte autoritativa do status de aprovação: a resposta do login (não o user
  // mesclado do store, que pode não carregar isApproved).
  const isPending = isAuthenticated && session?.user?.isApproved === false;
  const router = useRouter();
  const pathname = usePathname();
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const fetchTasksForProjects = useTaskStore((s) => s.fetchTasksForProjects);
  const fetchAllTimeLogs = useTaskStore((s) => s.fetchAllTimeLogs);
  const fetchNotifications = useUIStore((s) => s.fetchNotifications);
  const fetchUsers = useUserStore((s) => s.fetchUsers);
  useSyncWorkSession(isAuthenticated && !isPending);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    if (isAuthenticated && !isPending) {
      void preloadMainPages();
      fetchProjects()
        .then(() => {
          const ids = useProjectStore.getState().projects.map((project) => project.id);
          return fetchTasksForProjects(ids);
        })
        .catch(() => {});
      fetchAllTimeLogs().catch(() => {});
      fetchUsers().catch(() => {});
      fetchNotifications().catch(() => {});
    }
  }, [isAuthenticated, isPending, fetchNotifications, fetchProjects, fetchTasksForProjects, fetchAllTimeLogs, fetchUsers]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse" />
          <p className="text-sm text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (isPending) {
    return <AwaitingApproval userName={session?.user?.name} onLogout={logout} />;
  }

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <div data-print-hide className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div data-print-hide className="print:hidden">
          <Header title={title} />
        </div>
        <main className="flex-1 overflow-y-auto bg-zinc-950 w-full min-w-0 print:overflow-visible print:h-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
