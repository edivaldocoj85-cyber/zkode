"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

export function AnimatedNumber({
  value,
  format,
  className,
  duration = 1.1,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString("pt-BR"));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.textContent = fmt(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  // Valor correto no SSR / sem JS; a animação assume no cliente.
  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}
