"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text?: string | null;
  /** Nº de linhas visíveis quando recolhido. */
  collapsedLines?: number;
  className?: string;
  /** Texto exibido quando não há conteúdo. */
  emptyFallback?: string;
}

/**
 * Exibe texto longo recolhido em N linhas com um botão "Ver mais / Ver menos".
 * Evita a "rolagem absurda" de observações/descrições gigantes: o texto grande
 * fica clampado e o usuário decide expandir. O botão só aparece quando o texto
 * realmente transborda (senão seria ruído). Sempre quebra palavras longas para
 * nunca estourar a largura do container.
 */
export function ExpandableText({
  text,
  collapsedLines = 6,
  className,
  emptyFallback = "Nenhuma observação registrada.",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  const isEmpty = !text?.trim();
  const content = isEmpty ? emptyFallback : (text as string);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Quando recolhido, clientHeight = N linhas; scrollHeight = texto inteiro.
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [content, collapsedLines, expanded]);

  return (
    <div className={className}>
      <p
        ref={ref}
        className={cn(
          "text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap break-words",
          isEmpty && "text-zinc-500 italic",
          !expanded && "overflow-hidden",
          // Ao expandir, NÃO despeja o texto inteiro (rolagem gigante da página).
          // Limita a altura e rola dentro do próprio bloco.
          expanded && "max-h-[40vh] overflow-y-auto scrollbar-thin pr-1",
        )}
        style={
          !expanded
            ? { display: "-webkit-box", WebkitLineClamp: collapsedLines, WebkitBoxOrient: "vertical" }
            : undefined
        }
      >
        {content}
      </p>
      {!isEmpty && (isClamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Ver menos</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Ver mais</>
          )}
        </button>
      )}
    </div>
  );
}
