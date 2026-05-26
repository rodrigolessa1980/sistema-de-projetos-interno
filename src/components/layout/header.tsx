"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Moon, Sun, Command, X, Timer, AlertTriangle, Clock, CheckCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useTaskStore, useProjectStore } from "@/stores";
import { useActiveWorkSession } from "@/hooks/use-work-session";
import Link from "next/link";
import type { Notification } from "@/types";

export function Header({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();
  const { notifications, markNotificationRead, markAllRead } = useUIStore();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const { activeSession, elapsedFormatted } = useActiveWorkSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tarefas vencidas: dueDate no passado e status não finalizado
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    if (t.status === "CONCLUIDA" || t.status === "CANCELADA") return false;
    // Desenvolvedor vê apenas as suas; admin vê todas
    if (!isAdmin && t.assigneeId !== user?.id) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  });

  const visibleNotifications = notifications.filter((notif) => notif.userId === user?.id);
  const visibleUnreadCount = visibleNotifications.filter((notif) => !notif.read).length;
  const totalAlerts = overdueTasks.length + visibleUnreadCount;

  const activeTask = activeSession ? tasks.find((t) => t.id === activeSession.taskId) : null;

  const searchResults = useCallback(() => {
    if (!searchQuery.trim()) return { tasks: [], projects: [] };
    const q = searchQuery.toLowerCase();
    return {
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5),
      projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [searchQuery, tasks, projects])();

  const openNotification = (notif: Notification) => {
    markNotificationRead(notif.id);
    if (notif.relatedTaskId) {
      router.push(`/tasks/${notif.relatedTaskId}`);
    } else if (notif.relatedProjectId) {
      router.push(`/projects/${notif.relatedProjectId}`);
    }
  };

  return (
    <header className="h-14 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-base font-semibold text-zinc-100">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Indicador de sessão de trabalho ativa */}
        <AnimatePresence>
          {activeTask && activeSession && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Link
                href={`/tasks/${activeTask.id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/15 transition-all group"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <Timer className="w-3.5 h-3.5 text-violet-400" />
                <span className="font-mono text-sm font-bold text-violet-300 tabular-nums">
                  {elapsedFormatted}
                </span>
                <span className="hidden lg:block text-xs text-zinc-400 max-w-32 truncate group-hover:text-zinc-200 transition-colors">
                  {activeTask.title}
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:block">Pesquisar...</span>
            <kbd className="hidden md:flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-zinc-700/50 rounded border border-zinc-600/50">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          <AnimatePresence>
            {searchOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-[480px] bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Pesquisar tarefas, projetos..."
                      className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
                    />
                    <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                      <X className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {searchQuery.trim() === "" ? (
                      <p className="text-center text-zinc-500 text-sm py-8">Digite para pesquisar...</p>
                    ) : (
                      <>
                        {searchResults.projects.length > 0 && (
                          <div className="mb-2">
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase px-2 mb-1">Projetos</p>
                            {searchResults.projects.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => { router.push(`/projects/${p.id}`); setSearchOpen(false); setSearchQuery(""); }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                              >
                                <div className="w-6 h-6 rounded" style={{ background: p.color }} />
                                <span className="text-sm text-zinc-200">{p.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.tasks.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase px-2 mb-1">Tarefas</p>
                            {searchResults.tasks.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => { router.push(`/tasks/${t.id}`); setSearchOpen(false); setSearchQuery(""); }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-0.5" />
                                <span className="text-sm text-zinc-200 truncate">{t.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.tasks.length === 0 && searchResults.projects.length === 0 && (
                          <p className="text-center text-zinc-500 text-sm py-8">Nenhum resultado encontrado</p>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-zinc-400 hover:text-zinc-100"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button aria-label="Abrir notificacoes" variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-zinc-100 relative">
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className={cn(
                  "absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center",
                  overdueTasks.length > 0 ? "bg-red-500" : "bg-violet-500"
                )}>
                  {totalAlerts > 9 ? "9+" : totalAlerts}
                </span>
              )}
            </Button>}
          />
          <DropdownMenuContent align="end" className="w-96 bg-zinc-900 border-zinc-700/50 p-0">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-100">Notificações</span>
                {totalAlerts > 0 && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    overdueTasks.length > 0 ? "bg-red-500/20 text-red-400" : "bg-violet-500/20 text-violet-400"
                  )}>
                    {totalAlerts}
                  </span>
                )}
              </div>
              {visibleUnreadCount > 0 && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); markAllRead(user?.id); }}
                  className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <CheckCheck className="w-3 h-3" /> Marcar lidas
                </button>
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {/* ── Alertas de prazo vencido ── */}
              {overdueTasks.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-red-500/5 border-b border-red-500/10">
                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                      Prazo Vencido — {overdueTasks.length} tarefa{overdueTasks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {overdueTasks.map((task) => {
                    const due = new Date(task.dueDate!);
                    due.setHours(0, 0, 0, 0);
                    const daysLate = Math.floor((today.getTime() - due.getTime()) / 86_400_000);
                    const project = projects.find((p) => p.id === task.projectId);
                    return (
                      <div
                        key={task.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        onKeyDown={(e) => e.key === "Enter" && router.push(`/tasks/${task.id}`)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-red-500/5 border-b border-zinc-800/30 transition-colors cursor-pointer"
                      >
                        <div className="mt-0.5 w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0">
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-100 truncate leading-snug">{task.title}</p>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">{project?.name ?? "—"}</p>
                          <span className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 text-[10px] font-semibold border border-red-500/20">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {daysLate === 1 ? "1 dia em atraso" : `${daysLate} dias em atraso`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── Notificações normais ── */}
              {visibleNotifications.length > 0 && (
                <>
                  {overdueTasks.length > 0 && (
                    <div className="px-4 py-2 border-b border-zinc-800/60">
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Notificações</span>
                    </div>
                  )}
                  {visibleNotifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openNotification(notif)}
                      onKeyDown={(e) => e.key === "Enter" && openNotification(notif)}
                      className={cn(
                        "flex flex-col gap-1 px-4 py-3 border-b border-zinc-800/30 last:border-0 cursor-pointer hover:bg-zinc-800/40 transition-colors",
                        !notif.read && "bg-violet-500/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />}
                        <span className={cn("text-sm font-medium leading-snug", notif.read ? "text-zinc-400 ml-3.5" : "text-zinc-100")}>
                          {notif.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 ml-3.5 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-zinc-600 ml-3.5">{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                  ))}
                </>
              )}

              {overdueTasks.length === 0 && visibleNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Bell className="w-6 h-6 text-zinc-700" />
                  <p className="text-sm text-zinc-500">Nenhuma notificação</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/profile" aria-label="Abrir perfil" title="Abrir perfil">
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-zinc-700 text-xs text-zinc-200">
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
