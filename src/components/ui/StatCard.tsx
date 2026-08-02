"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { AnimatedNumber } from "./AnimatedNumber";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  format,
  icon: Icon,
  hint,
  tone = "accent",
  index = 0,
}: {
  label: string;
  value: number;
  format?: (n: number) => string;
  icon: LucideIcon;
  hint?: string;
  tone?: "accent" | "success" | "warning" | "danger" | "info";
  index?: number;
}) {
  const toneColor = {
    accent: "text-accent",
    success: "text-[var(--success)]",
    warning: "text-[var(--warning)]",
    danger: "text-[var(--danger)]",
    info: "text-[var(--info)]",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <SpotlightCard className="hairline-top p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-muted">{label}</p>
          <span
            className={cn(
              "grid size-9 place-items-center rounded-xl bg-fg/[0.05] ring-1 ring-inset ring-border",
              toneColor,
            )}
          >
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>
        </div>
        <p className="mt-4 font-mono text-[2rem] font-semibold leading-none tracking-tight tnum text-fg">
          <AnimatedNumber value={value} format={format} />
        </p>
        {hint && <p className="mt-2 text-xs text-subtle">{hint}</p>}
      </SpotlightCard>
    </motion.div>
  );
}
