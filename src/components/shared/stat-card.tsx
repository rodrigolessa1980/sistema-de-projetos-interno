"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  color?: string;
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = "violet", className, delay = 0 }: StatCardProps) {
  const colorMap: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", icon: "text-violet-400", border: "border-violet-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "text-emerald-400", border: "border-emerald-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "text-amber-400", border: "border-amber-500/20" },
    red: { bg: "bg-red-500/10", text: "text-red-400", icon: "text-red-400", border: "border-red-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "text-blue-400", border: "border-blue-500/20" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", icon: "text-cyan-400", border: "border-cyan-500/20" },
  };

  const colors = colorMap[color] ?? colorMap.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "relative bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 overflow-hidden group hover:border-zinc-700/50 transition-colors",
        className
      )}
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity", colors.bg, "rounded-xl")} style={{ opacity: 0.02 }} />
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-4.5 h-4.5", colors.icon)} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md",
            trend > 0 ? "bg-emerald-500/15 text-emerald-400" : trend < 0 ? "bg-red-500/15 text-red-400" : "bg-zinc-700/50 text-zinc-400"
          )}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1">{value}</p>
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}
