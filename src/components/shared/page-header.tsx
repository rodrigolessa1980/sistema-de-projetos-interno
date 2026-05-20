import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type ActionItem = {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost";
};

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ActionItem[] | ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, description, actions, children }: PageHeaderProps) {
  const isArray = Array.isArray(actions);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-6 px-6 border-b border-zinc-800/50"
    >
      <div>
        <h1 className="text-xl font-bold text-zinc-100">{title}</h1>
        {description && <p className="text-sm text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {isArray
          ? (actions as ActionItem[]).map((action) => {
              const Icon = action.icon ?? Plus;
              return (
                <Button
                  key={action.label}
                  onClick={action.onClick}
                  variant={action.variant ?? "default"}
                  size="sm"
                  className={action.variant ? undefined : "bg-violet-600 hover:bg-violet-700 text-white"}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {action.label}
                </Button>
              );
            })
          : actions}
      </div>
    </motion.div>
  );
}
