"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { FIELD_LIMITS } from "@/lib/field-limits";

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const minLen = FIELD_LIMITS.user.passwordMin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Informe a senha atual");
      return;
    }
    if (newPassword.length < minLen) {
      toast.error(`A nova senha deve ter pelo menos ${minLen} caracteres`);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("A confirmação não confere com a nova senha");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("A nova senha deve ser diferente da atual");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("auth/change-password", { currentPassword, newPassword });
      toast.success("Senha alterada com sucesso");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível alterar a senha");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-6 max-w-lg">
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-zinc-100">Alterar senha</h3>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Confirme sua senha atual e defina uma nova (mínimo {minLen} caracteres).
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-zinc-400 text-xs">Senha atual</Label>
          <Input
            type={show ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            maxLength={FIELD_LIMITS.user.passwordMax}
            placeholder="Sua senha atual"
            className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-violet-500"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-zinc-400 text-xs">Nova senha</Label>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              maxLength={FIELD_LIMITS.user.passwordMax}
              placeholder={`Mínimo ${minLen} caracteres`}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-violet-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label={show ? "Ocultar senhas" : "Mostrar senhas"}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-zinc-400 text-xs">Confirmar nova senha</Label>
          <Input
            type={show ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            maxLength={FIELD_LIMITS.user.passwordMax}
            placeholder="Repita a nova senha"
            className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-violet-500"
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 disabled:opacity-60"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {isSaving ? "Salvando..." : "Alterar senha"}
          </Button>
        </div>
      </form>
    </div>
  );
}
