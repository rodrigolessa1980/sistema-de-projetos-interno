"use client";

import { Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AwaitingApprovalProps {
  userName?: string;
  groupName?: string;
  onLogout: () => void;
}

export function AwaitingApproval({ userName, groupName, onLogout }: AwaitingApprovalProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <Clock className="h-7 w-7 text-amber-400" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-zinc-100">Cadastro aguardando autorização</h1>
        <p className="mb-6 text-sm leading-relaxed text-zinc-400">
          {userName ? `Olá, ${userName}. ` : ""}Seu cadastro
          {groupName ? ` no grupo ${groupName}` : ""} foi recebido e está aguardando a aprovação de
          um administrador. Você poderá acessar o sistema assim que for liberado.
        </p>
        <Button variant="outline" onClick={onLogout} className="gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  );
}
