"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/ui-store";
import { Check, ChevronsUpDown, UserRoundCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface ReassignPopoverProps {
  currentUserId?: string | null;
  onReassign: (userId: string | null) => void;
  label?: string;
  allowClear?: boolean;
  filterIds?: string[];
}

export function ReassignPopover({
  currentUserId,
  onReassign,
  label = "Reatribuir",
  allowClear = false,
  filterIds,
}: ReassignPopoverProps) {
  const { users } = useUserStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const available = users.filter((u) => {
    if (filterIds && !filterIds.includes(u.id)) return false;
    if (!search) return true;
    return u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
  });

  const current = users.find((u) => u.id === currentUserId);

  function handleSelect(user: User) {
    onReassign(user.id);
    setOpen(false);
    setSearch("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-[10px] text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 gap-1 font-normal"
        >
          <UserRoundCog className="w-3 h-3" />
          {label}
          <ChevronsUpDown className="w-2.5 h-2.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 bg-zinc-950 border-zinc-800 shadow-2xl"
        align="start"
      >
        <div className="p-2 border-b border-zinc-800">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-1 mb-1.5">
            {label}
          </p>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuário..."
            className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-500/50"
          />
        </div>

        <div className="py-1 max-h-52 overflow-y-auto">
          {allowClear && current && (
            <button
              onClick={() => { onReassign(null); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-red-400" />
              Remover responsável
            </button>
          )}

          {available.length === 0 && (
            <p className="text-xs text-zinc-600 text-center py-4">Nenhum usuário encontrado</p>
          )}

          {available.map((u) => {
            const isSelected = u.id === currentUserId;
            return (
              <button
                key={u.id}
                onClick={() => handleSelect(u)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 text-left transition-colors",
                  isSelected
                    ? "bg-violet-500/10 text-violet-300"
                    : "hover:bg-zinc-900 text-zinc-300"
                )}
              >
                <Avatar className="w-6 h-6 shrink-0">
                  <AvatarFallback className="text-[9px] bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                    {u.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{u.name}</p>
                  <p className="text-[10px] text-zinc-600 truncate">{u.position}</p>
                </div>
                {isSelected && <Check className="w-3 h-3 text-violet-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
