"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Check } from "lucide-react";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export function PrintButton({ label = "Imprimir / PDF", className }: PrintButtonProps) {
  const [printed, setPrinted] = useState(false);

  function handlePrint() {
    setPrinted(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrinted(false), 2000);
    }, 80);
  }

  return (
    <Button
      onClick={handlePrint}
      data-print-hide
      variant="outline"
      size="sm"
      className={`h-8 px-3 gap-1.5 text-xs border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 transition-all ${className ?? ""}`}
    >
      {printed ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Enviando...</span>
        </>
      ) : (
        <>
          <Printer className="w-3.5 h-3.5" />
          {label}
        </>
      )}
    </Button>
  );
}
