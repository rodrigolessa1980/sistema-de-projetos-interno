"use client";

import { usePathname, useRouter } from "@/lib/router";
import Link from "@/lib/router";
import { motion, AnimatePresence } from "@/lib/motion";
import {
  LayoutDashboard, FolderKanban, ListTodo, Kanban, GitBranch,
  BarChart3, Clock, Network, Users, ChevronLeft, ChevronRight,
  Zap, Settings, LogOut, ChevronDown, Box, Layers,
  FileBarChart2, ClipboardList, Timer, TrendingUp, ListOrdered, Building2, Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const navItems = [
  { group: "Principal", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  ]},
  { group: "Projetos", items: [
    { href: "/projects", label: "Projetos", icon: FolderKanban, adminOnly: false },
    { href: "/queue", label: "Fila de Dev", icon: ListOrdered, adminOnly: false },
    { href: "/modules", label: "Módulos", icon: Box, adminOnly: false },
    { href: "/epics", label: "Epics", icon: Layers, adminOnly: false },
    { href: "/companies", label: "Empresas", icon: Building2, adminOnly: false },
  ]},
  { group: "Trabalho", items: [
    { href: "/my-queue", label: "Minha Fila", icon: Inbox, adminOnly: false },
    { href: "/tasks", label: "Tarefas", icon: ListTodo, adminOnly: false },
    { href: "/kanban", label: "Kanban", icon: Kanban, adminOnly: false },
    { href: "/gantt", label: "Timeline", icon: GitBranch, adminOnly: false },
    { href: "/dependencies", label: "Dependências", icon: Network, adminOnly: false },
  ]},
  { group: "Análise", items: [
    { href: "/metrics", label: "Métricas", icon: BarChart3, adminOnly: false },
    { href: "/time-logs", label: "Logs de Tempo", icon: Clock, adminOnly: false },
  ]},
  { group: "Relatórios", items: [
    { href: "/reports/productivity", label: "Produtividade", icon: TrendingUp, adminOnly: false },
    { href: "/reports/hours", label: "Horas por Tarefa", icon: Timer, adminOnly: false },
    { href: "/reports/projects", label: "Progresso Projetos", icon: ClipboardList, adminOnly: false },
    { href: "/reports/overview", label: "Visão Geral", icon: FileBarChart2, adminOnly: true },
  ]},
  { group: "Admin", items: [
    { href: "/users", label: "Usuários", icon: Users, adminOnly: true },
  ]},
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout, isAdmin } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Principal", "Projetos", "Trabalho", "Análise", "Relatórios", "Admin"]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-zinc-950 border-r border-zinc-800/50 shrink-0 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-zinc-900 dark:text-white text-sm tracking-tight whitespace-nowrap">DevFlow</span>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-violet-500/20 text-violet-400 border-violet-500/30">
                BETA
              </Badge>
            </motion.div>
          )}
          {sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto"
            >
              <Zap className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-zinc-800">
        {navItems.map((group) => {
          const visibleItems = group.items.filter((item) => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.group} className="mb-1">
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-400 transition-colors"
                >
                  <span>{group.group}</span>
                  <ChevronDown
                    className={cn("w-3 h-3 transition-transform", expandedGroups.includes(group.group) && "rotate-180")}
                  />
                </button>
              )}
              <AnimatePresence>
                {(sidebarCollapsed || expandedGroups.includes(group.group)) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    {visibleItems.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      const Icon = item.icon;

                      if (sidebarCollapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger
                              render={<Link
                                href={item.href}
                                className={cn(
                                  "flex items-center justify-center w-10 h-10 mx-auto rounded-lg mb-0.5 transition-all",
                                  isActive
                                    ? "bg-violet-600/20 text-violet-400"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
                                )}
                              >
                                <Icon className="w-4.5 h-4.5" />
                              </Link>}
                            />
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        );
                      }

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm transition-all group",
                            isActive
                              ? "bg-violet-600/15 text-violet-300 font-medium"
                              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                          )}
                        >
                          <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                          <span className="truncate">{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto w-1 h-4 bg-violet-500 rounded-full"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800/50 p-3">
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-zinc-700 text-xs">{user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-zinc-700 text-xs">{user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">{user?.name}</p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.role === "ADMIN" ? "Administrador" : "Desenvolvedor"}</p>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={<Link href="/profile" className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </Link>}
                />
                <TooltipContent>Perfil</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={<button
                    onClick={handleLogout}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>}
                />
                <TooltipContent>Sair</TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
