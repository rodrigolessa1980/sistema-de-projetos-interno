"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkTheme = resolvedTheme !== "light";
  const nextThemeLabel = isDarkTheme ? "claro" : "escuro";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-8 h-8 text-zinc-400 hover:text-zinc-100"
      aria-label={`Ativar modo ${nextThemeLabel}`}
      title={`Ativar modo ${nextThemeLabel}`}
      onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
    >
      {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}
