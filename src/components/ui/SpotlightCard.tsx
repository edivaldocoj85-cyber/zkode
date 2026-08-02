"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Card de vidro com brilho que segue o cursor (spotlight) e leve elevação.
 */
export function SpotlightCard({
  children,
  className,
  interactive = true,
  ...rest
}: Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  interactive?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const [hover, setHover] = useState(false);

  const background = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, var(--accent-glow), transparent 70%)`;

  function onMove(e: React.MouseEvent) {
    if (!interactive) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-surface card-shadow transition-colors duration-300",
        interactive && "hover:border-border-strong",
        className,
      )}
      {...rest}
    >
      {interactive && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ background, opacity: hover ? 1 : 0 }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
