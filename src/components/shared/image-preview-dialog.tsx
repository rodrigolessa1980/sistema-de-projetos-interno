"use client";

import { useEffect, useState } from "react";
import { Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

function downloadDataUrl(dataUrl: string, name: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export interface ImagePreviewDialogProps {
  /** Imagem a exibir; `null` mantém o modal fechado. */
  image: { dataUrl: string; name: string } | null;
  onClose: () => void;
}

/**
 * Modal de visualização de imagem: abre a imagem em tela cheia, permite
 * expandir/dar zoom (1x–4x) e baixar. Reutilizado nos anexos de tarefa e módulo.
 */
export function ImagePreviewDialog({ image, onClose }: ImagePreviewDialogProps) {
  const [zoom, setZoom] = useState(1);

  // Reseta o zoom sempre que troca a imagem (ou fecha), para não abrir ampliado.
  useEffect(() => {
    setZoom(1);
  }, [image?.dataUrl]);

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const toggleZoom = () => setZoom((z) => (z > 1 ? 1 : 2));

  return (
    <Dialog
      open={image !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="bg-zinc-950 border-zinc-700/50 ring-zinc-700/50 max-w-5xl w-[min(95vw,960px)] p-3 sm:p-4"
      >
        <DialogTitle className="pr-8 text-sm font-medium text-zinc-200 truncate">
          {image?.name ?? "Visualização da imagem"}
        </DialogTitle>

        {/* Área da imagem — rola quando ampliada além do container. */}
        <div className="flex items-center justify-center rounded-lg bg-zinc-900/60 border border-zinc-800/60 max-h-[75vh] overflow-auto p-2">
          {image && (
            <img
              src={image.dataUrl}
              alt={image.name}
              onClick={toggleZoom}
              style={{ transform: `scale(${zoom})` }}
              className={cn(
                "max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-md transition-transform duration-200 origin-center",
                zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
              )}
            />
          )}
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              title="Reduzir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-zinc-500 tabular-nums w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
              title="Expandir / restaurar"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              if (!image) return;
              downloadDataUrl(image.dataUrl, image.name);
              toast.success(`Download de "${image.name}" iniciado`);
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Baixar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
