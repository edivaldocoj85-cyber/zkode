"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ModalSize = "sm" | "md" | "lg" | "xl";

/** Teto de largura por tamanho — sempre com margem de segurança em telas pequenas (max-w-[95vw]). */
const sizes: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-xl lg:max-w-2xl",
  lg: "sm:max-w-2xl lg:max-w-4xl",
  xl: "sm:max-w-3xl lg:max-w-6xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Controla o teto de largura em telas ≥sm; útil quando o conteúdo precisa de mais respiro (ex.: preview de contrato). */
  size?: ModalSize;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
          <motion.div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative z-10 my-auto flex max-h-[92dvh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border border-border-strong bg-surface card-shadow hairline-top",
              sizes[size],
            )}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="flex shrink-0 items-start gap-4 border-b border-border px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight text-fg sm:text-lg">
                  {title}
                </h2>
                {description && (
                  <p className="mt-0.5 text-sm text-muted">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-auto grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-fg/[0.06] hover:text-fg"
                aria-label="Fechar"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              {children}
            </div>

            {footer && (
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-surface-2/50 px-4 py-3 sm:px-6 sm:py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
