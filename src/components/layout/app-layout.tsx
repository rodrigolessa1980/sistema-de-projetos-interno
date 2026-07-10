"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";
import { useSyncWorkSession } from "@/hooks/use-work-session";
import { useDeltaSync } from "@/hooks/use-delta-sync";
import { useRouter, usePathname } from "@/lib/router";
import { useEffect } from "react";
import { useProjectStore, useTaskStore, useUIStore, useUserStore } from "@/stores";
import { preloadMainPages } from "@/lib/page-loaders";
import { AwaitingApproval } from "@/components/auth/awaiting-approval";
import { cn } from "@/lib/utils";

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
  const fetchAllTimeLogs = useTaskStore((s) => s.fetchAllTimeLogs);
  const fetchNotifications = useUIStore((s) => s.fetchNotifications);
  const fetchUsers = useUserStore((s) => s.fetchUsers);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen);
  useSyncWorkSession(isAuthenticated && !isPending);
  // INC-12: delta sync — vê mudanças de outros usuários sem recarregar a página.
  useDeltaSync(isAuthenticated && !isPending);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Fecha o drawer da sidebar sempre que a rota muda (mobile).
  useEffect(() => {
    setSidebarMobileOpen(false);
  }, [pathname, setSidebarMobileOpen]);

  useEffect(() => {
    if (isAuthenticated && !isPending) {
      void preloadMainPages();
      // INC-01: fetchProjects agora carrega projetos + módulos + épicos + tasks numa
      // única chamada agregada (/bootstrap); não é mais preciso buscar tasks por projeto.
      fetchProjects().catch(() => {});
      fetchAllTimeLogs().catch(() => {});
      fetchUsers().catch(() => {});
      fetchNotifications().catch(() => {});
    }
  }, [isAuthenticated, isPending, fetchNotifications, fetchProjects, fetchAllTimeLogs, fetchUsers]);

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
      {/* Backdrop do drawer — só no mobile, fecha ao tocar fora */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarMobileOpen(false)}
          aria-hidden
        />
      )}
      {/* Sidebar: drawer deslizante no mobile, fixa no fluxo no desktop (md+) */}
      <div
        data-print-hide
        className={cn(
          "print:hidden z-50 shrink-0 transition-transform duration-200 ease-in-out",
          "fixed inset-y-0 left-0 md:static md:translate-x-0",
          sidebarMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
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
