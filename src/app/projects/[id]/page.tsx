"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useProjectStore, useTaskStore, useUserStore } from "@/stores";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Clock, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getProjectById, getModulesByProject, getEpicsByProject } = useProjectStore();
  const { getTasksByProject } = useTaskStore();
  const { users } = useUserStore();

  const project = getProjectById(id);
  if (!project) notFound();

  const modules = getModulesByProject(id);
  const epics = getEpicsByProject(id);
  const tasks = getTasksByProject(id);
  const devs = users.filter((u) => project.developerIds.includes(u.id));

  const tasksByModule = modules.map((mod) => ({
    module: mod,
    tasks: tasks.filter((t) => t.moduleId === mod.id),
    epics: epics.filter((e) => e.moduleId === mod.id),
  }));

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/projects" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Projetos
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-300">{project.name}</span>
        </div>

        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: project.color }}>
            {project.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-100">{project.name}</h1>
            <p className="text-sm text-zinc-400 mt-1">{project.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Progresso", value: `${project.progress}%`, icon: CheckCircle2 },
            { label: "Horas Gastas", value: `${project.actualHours}h`, icon: Clock },
            { label: "Tasks Totais", value: tasks.length, icon: Layers },
            { label: "Bloqueadas", value: tasks.filter((t) => t.status === "BLOQUEADA").length, icon: AlertTriangle },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-zinc-500" />
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-zinc-100">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="modules" className="data-[state=active]:bg-zinc-800">Módulos</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-zinc-800">Tasks</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-zinc-800">Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-3">
            {tasksByModule.map(({ module, tasks: modTasks, epics: modEpics }, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-zinc-100">{module.name}</h3>
                  <span className="text-sm text-zinc-400">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-1.5 bg-zinc-800 mb-3" />
                <p className="text-xs text-zinc-500 mb-3">{module.description}</p>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>{modEpics.length} epics</span>
                  <span>{modTasks.length} tasks</span>
                  <span>{modTasks.filter((t) => t.status === "CONCLUIDA").length} concluídas</span>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="tasks">
            <div className="space-y-2">
              {tasks.map((task) => {
                const assignee = users.find((u) => u.id === task.assigneeId);
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-colors"
                  >
                    <StatusBadge status={task.status} className="text-[10px] shrink-0" />
                    <span className="flex-1 text-sm text-zinc-200 truncate">{task.title}</span>
                    <ComplexityBadge complexity={task.complexity} />
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={assignee?.avatar} />
                      <AvatarFallback className="text-[9px] bg-zinc-700">{assignee?.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {devs.map((dev) => {
                const devTasks = tasks.filter((t) => t.assigneeId === dev.id);
                const completedTasks = devTasks.filter((t) => t.status === "CONCLUIDA").length;
                return (
                  <div key={dev.id} className="flex items-center gap-3 p-4 bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={dev.avatar} />
                      <AvatarFallback className="bg-zinc-700">{dev.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-100">{dev.name}</p>
                      <p className="text-xs text-zinc-500">{dev.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-zinc-200">{devTasks.length}</p>
                      <p className="text-xs text-zinc-500">{completedTasks} concluídas</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
