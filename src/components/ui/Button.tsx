"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "danger" | "subtle";
type Size = "xs" | "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg font-semibold shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] hover:brightness-110 active:brightness-95 accent-glow",
  ghost: "text-muted hover:text-fg hover:bg-fg/[0.06] active:bg-fg/[0.1]",
  outline:
    "border border-border-strong text-fg hover:bg-fg/[0.05] hover:border-fg/20 active:bg-fg/[0.08]",
  danger:
    "bg-[var(--danger)]/12 text-[var(--danger)] hover:bg-[var(--danger)]/20 active:bg-[var(--danger)]/25 border border-[var(--danger)]/25",
  subtle: "bg-fg/[0.06] text-fg hover:bg-fg/[0.1] active:bg-fg/[0.14]",
};

const sizes: Record<Size, string> = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-lg",
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2 rounded-xl",
  icon: "size-10 rounded-xl justify-center",
};

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  /** Mostra spinner e bloqueia interação, sem trocar o layout do botão. */
  loading?: boolean;
  children?: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      whileHover={isDisabled ? undefined : { y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium",
        "transition-[background-color,border-color,color,filter,box-shadow] duration-150",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:saturate-[0.6]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <span className={cn("inline-flex items-center gap-[inherit]", loading && "invisible")}>
        {children}
      </span>
      {loading && (
        <Loader2
          className={cn(
            "absolute animate-spin",
            size === "xs" || size === "sm" ? "size-3.5" : "size-4",
          )}
          aria-hidden
        />
      )}
    </motion.button>
  );
}
