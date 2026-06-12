"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type MotionValues = Record<string, unknown> & {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  height?: number | string | false;
  width?: number | string;
};

type MotionProps = React.HTMLAttributes<HTMLElement> & {
  initial?: MotionValues | false;
  animate?: MotionValues;
  exit?: MotionValues;
  transition?: Record<string, unknown>;
  layout?: boolean;
  layoutId?: string;
};

function toTransform(values?: MotionValues): string | undefined {
  if (!values) return undefined;
  const parts: string[] = [];
  if (values.x !== undefined) parts.push(`translateX(${values.x}px)`);
  if (values.y !== undefined) parts.push(`translateY(${values.y}px)`);
  const scaleX = values.scaleX ?? values.scale;
  const scaleY = values.scaleY ?? values.scale;
  if (scaleX !== undefined || scaleY !== undefined) {
    parts.push(`scale(${scaleX ?? 1}, ${scaleY ?? 1})`);
  }
  return parts.length > 0 ? parts.join(" ") : undefined;
}

function createMotion(tag: keyof React.JSX.IntrinsicElements) {
  const MotionComponent = React.forwardRef<HTMLElement, MotionProps>(function MotionComponent(
    {
      initial,
      animate,
      exit: _exit,
      transition,
      layout: _layout,
      layoutId: _layoutId,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) {
    const [active, setActive] = useState(false);

    useEffect(() => {
      const id = window.requestAnimationFrame(() => setActive(true));
      return () => window.cancelAnimationFrame(id);
    }, []);

    const from = initial === false ? {} : (initial ?? { opacity: 0, y: 12 });
    const to = animate ?? { opacity: 1, y: 0 };
    const duration = Number(transition?.duration ?? 0.3);
    const delay = Number(transition?.delay ?? 0);
    const current = active ? to : from;

    const motionStyle: React.CSSProperties = {
      transitionProperty: "opacity, transform, width, height, max-height, stroke-dashoffset",
      transitionDuration: `${duration}s`,
      transitionDelay: `${delay}s`,
      transitionTimingFunction:
        transition?.type === "spring" ? "cubic-bezier(0.22, 1, 0.36, 1)" : "ease-out",
      opacity: typeof current.opacity === "number" ? current.opacity : undefined,
      transform: toTransform(current),
      ...style,
    };

    if (current.width !== undefined) motionStyle.width = current.width as React.CSSProperties["width"];
    if (current.height !== undefined && current.height !== false) {
      motionStyle.height = current.height as React.CSSProperties["height"];
      if (current.height === 0) motionStyle.overflow = "hidden";
    }
    if (current.strokeDashoffset !== undefined) {
      motionStyle.strokeDashoffset = current.strokeDashoffset as number;
    }

    return React.createElement(
      tag,
      {
        ref,
        className: cn(className),
        style: motionStyle,
        ...props,
      },
      children,
    );
  });

  MotionComponent.displayName = `motion.${String(tag)}`;
  return MotionComponent;
}

const motionCache = new Map<string, ReturnType<typeof createMotion>>();

function getMotionComponent(tag: string) {
  if (!motionCache.has(tag)) {
    motionCache.set(tag, createMotion(tag as keyof React.JSX.IntrinsicElements));
  }
  return motionCache.get(tag)!;
}

export const motion = new Proxy(
  {
    div: createMotion("div"),
    tr: createMotion("tr"),
    p: createMotion("p"),
    button: createMotion("button"),
    main: createMotion("main"),
    aside: createMotion("aside"),
    circle: createMotion("circle"),
  },
  {
    get(target, prop: string) {
      if (prop in target) {
        return target[prop as keyof typeof target];
      }
      return getMotionComponent(prop);
    },
  },
);

export function AnimatePresence({
  children,
  mode: _mode,
}: {
  children: React.ReactNode;
  mode?: string;
}) {
  return <>{children}</>;
}
