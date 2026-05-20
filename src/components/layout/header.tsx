"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Moon, Sun, Command, X, Timer } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useTaskStore, useProjectStore } from "@/stores";
import { useActiveWorkSession } from "@/hooks/use-work-session";
import Link from "next/link";

export function Header({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useUIStore();
  const { user } = useAuth();
  const router = useRouter();
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const { activeSession, elapsedFormatted } = useActiveWorkSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeTask = activeSession ? tasks.find((t) => t.id === activeSession.taskId) : null;

  const searchResults = useCallback(() => {
    if (!searchQuery.trim()) return { tasks: [], projects: [] };
    const q = searchQuery.toLowerCase();
    return {
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5),
      projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [searchQuery, tasks, projects])();

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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-zinc-100 relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-700/50">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0 text-sm font-semibold">Notificações</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-violet-400 hover:text-violet-300">
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <DropdownMenuSeparator className="bg-zinc-700/50" />
            <div className="max-h-72 overflow-y-auto">
              {notifications.slice(0, 8).map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className={cn(
                    "flex flex-col items-start gap-1 px-3 py-3 cursor-pointer",
                    !notif.read && "bg-violet-500/5"
                  )}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />}
                    <span className={cn("text-sm font-medium", notif.read ? "text-zinc-400 ml-3.5" : "text-zinc-100")}>
                      {notif.title}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 ml-3.5 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-zinc-600 ml-3.5">{formatRelativeTime(notif.createdAt)}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-zinc-700 text-xs text-zinc-200">
            {user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
