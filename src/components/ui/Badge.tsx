import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-fg/[0.06] text-muted border-border",
  success: "bg-[var(--success)]/12 text-[var(--success)] border-[var(--success)]/25",
  warning: "bg-[var(--warning)]/14 text-[var(--warning)] border-[var(--warning)]/25",
  danger: "bg-[var(--danger)]/14 text-[var(--danger)] border-[var(--danger)]/25",
  info: "bg-[var(--info)]/14 text-[var(--info)] border-[var(--info)]/25",
  accent: "bg-accent/14 text-accent border-accent/30",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
