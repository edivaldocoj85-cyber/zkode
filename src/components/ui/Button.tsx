"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg font-semibold hover:brightness-110 accent-glow",
  ghost: "text-muted hover:text-fg hover:bg-fg/[0.06]",
  outline: "border border-border-strong text-fg hover:bg-fg/[0.05]",
  danger:
    "bg-[var(--danger)]/12 text-[var(--danger)] hover:bg-[var(--danger)]/20 border border-[var(--danger)]/25",
  subtle: "bg-fg/[0.06] text-fg hover:bg-fg/[0.1]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2 rounded-xl",
  icon: "size-10 rounded-xl justify-center",
};

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex cursor-pointer items-center whitespace-nowrap font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
