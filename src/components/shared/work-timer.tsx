"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import { Play, Square, X, Timer, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWorkSession } from "@/hooks/use-work-session";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WorkTimerProps {
  taskId: string;
  taskTitle: string;
  /** Esconde o componente se o usuário não for o responsável */
  disabled?: boolean;
}

export function WorkTimer({ taskId, taskTitle, disabled = false }: WorkTimerProps) {
  const { isActive, elapsed, elapsedFormatted, hasOtherActiveSession, activeSession, start, stop, cancel } =
    useWorkSession(taskId);
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  if (disabled) return null;

  const handleStop = async () => {
    await stop(description.trim() || "Trabalho realizado");
    setDescription("");
    setStopDialogOpen(false);
  };

  // Calcula porcentagem animada do anel (caps a 2h = 7200s para referência visual)
  const ringProgress = Math.min(100, (elapsed / 7200) * 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-xl border transition-all",
          isActive
            ? "border-violet-500/40 bg-violet-500/5"
            : "border-zinc-800/50 bg-zinc-900/60"
        )}
      >
        {/* Cabeçalho sempre visível */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Anel de progresso + ícone */}
            <div className="relative w-10 h-10 shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#27272a" strokeWidth="3" />
                {isActive && (
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="94.25"
                    style={{
                      strokeDashoffset: 94.25 - (ringProgress / 100) * 94.25,
                      transition: "stroke-dashoffset 0.8s ease-out",
                    }}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Timer
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-violet-400" : "text-zinc-500"
                  )}
                />
              </div>
              {isActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-900 animate-pulse" />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-300">
                {isActive ? "Trabalhando agora" : "Controle de Tempo"}
              </p>
              {isActive ? (
                <motion.p
                  key={elapsedFormatted}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-mono font-bold text-violet-300 leading-none mt-0.5"
                >
                  {elapsedFormatted}
                </motion.p>
              ) : (
                <p className="text-xs text-zinc-500 mt-0.5">
                  {hasOtherActiveSession ? "Há trabalho ativo em outra tarefa" : "Clique em iniciar para começar"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isActive && (
              <button
                onClick={() => setShowDetails((v) => !v)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {!isActive ? (
              <Button
                onClick={start}
                disabled={hasOtherActiveSession}
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs font-semibold gap-1.5 transition-all",
                  hasOtherActiveSession
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                )}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Iniciar Trabalho
              </Button>
            ) : (
              <Button
                onClick={() => setStopDialogOpen(true)}
                size="sm"
                className="h-8 px-3 text-xs font-semibold gap-1.5 bg-red-600/80 hover:bg-red-600 text-white border-red-500/30"
              >
                <Square className="w-3 h-3 fill-current" />
                Finalizar
              </Button>
            )}
          </div>
        </div>

        {/* Painel de detalhes expandível */}
        <AnimatePresence>
          {isActive && showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-violet-500/20"
            >
              <div className="px-4 py-3 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Início", value: activeSession ? new Date(activeSession.startedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--" },
                    { label: "Decorrido", value: elapsedFormatted },
                    { label: "Horas (arred.)", value: `${Math.max(0.25, Math.round((elapsed / 3600) * 4) / 4)}h` },
                  ].map((item) => (
                    <div key={item.label} className="bg-zinc-800/60 rounded-lg py-2 px-3">
                      <p className="text-[10px] text-zinc-500 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-zinc-200 font-mono">{item.value}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={cancel}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar sessão sem registrar tempo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aviso de outra sessão ativa */}
        {hasOtherActiveSession && !isActive && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-300">
                Você está trabalhando em outra tarefa. Finalize para iniciar aqui.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Dialog de finalização */}
      <Dialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 flex items-center gap-2">
              <Square className="w-4 h-4 text-red-400" />
              Finalizar trabalho
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-sm">
              O tempo será registrado automaticamente no log da tarefa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Resumo da sessão */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
                <p className="text-[10px] text-zinc-500 mb-1">Tempo total</p>
                <p className="text-2xl font-mono font-bold text-violet-300">{elapsedFormatted}</p>
              </div>
              <div className="bg-zinc-800/60 rounded-xl p-3 text-center">
                <p className="text-[10px] text-zinc-500 mb-1">Será registrado</p>
                <p className="text-2xl font-mono font-bold text-emerald-400">
                  {Math.max(0.25, Math.round((elapsed / 3600) * 4) / 4)}h
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                O que você fez? <span className="text-zinc-600">(opcional)</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Ex: Implementação do módulo X, correção do bug Y...`}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-600 resize-none text-sm"
                rows={3}
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 text-zinc-400 hover:text-zinc-200 h-9 text-sm"
                onClick={() => setStopDialogOpen(false)}
              >
                Continuar trabalhando
              </Button>
              <Button
                className="flex-1 bg-red-600/80 hover:bg-red-600 text-white h-9 text-sm font-semibold"
                onClick={handleStop}
              >
                <Square className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Finalizar e registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
