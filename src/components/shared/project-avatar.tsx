"use client";

import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  name: string;
  color: string;
  avatar?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { container: "w-6 h-6 rounded-lg text-[9px]", img: "w-6 h-6 rounded-lg" },
  sm: { container: "w-8 h-8 rounded-lg text-xs", img: "w-8 h-8 rounded-lg" },
  md: { container: "w-10 h-10 rounded-xl text-sm", img: "w-10 h-10 rounded-xl" },
  lg: { container: "w-12 h-12 rounded-xl text-base", img: "w-12 h-12 rounded-xl" },
  xl: { container: "w-16 h-16 rounded-2xl text-xl", img: "w-16 h-16 rounded-2xl" },
};

export function ProjectAvatar({ name, color, avatar, size = "md", className }: ProjectAvatarProps) {
  const s = sizeMap[size];

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={cn(s.img, "object-cover shrink-0", className)}
      />
    );
  }

  return (
    <div
      className={cn(s.container, "flex items-center justify-center text-white font-bold shrink-0", className)}
      style={{ background: color }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
