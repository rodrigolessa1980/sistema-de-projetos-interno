import { motion } from "@/lib/motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-zinc-500" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-300 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm leading-relaxed mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm" className="bg-violet-600 hover:bg-violet-700">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
