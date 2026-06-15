"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";
import { useSyncWorkSession } from "@/hooks/use-work-session";
import { useRouter, usePathname } from "@/lib/router";
import { useEffect } from "react";
import { useProjectStore, useTaskStore, useUIStore, useUserStore } from "@/stores";
import { preloadMainPages } from "@/lib/page-loaders";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const fetchTasksForProjects = useTaskStore((s) => s.fetchTasksForProjects);
  const fetchAllTimeLogs = useTaskStore((s) => s.fetchAllTimeLogs);
  const fetchNotifications = useUIStore((s) => s.fetchNotifications);
  const fetchUsers = useUserStore((s) => s.fetchUsers);
  useSyncWorkSession(isAuthenticated);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    if (isAuthenticated) {
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
  }, [isAuthenticated, fetchNotifications, fetchProjects, fetchTasksForProjects, fetchAllTimeLogs, fetchUsers]);

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
