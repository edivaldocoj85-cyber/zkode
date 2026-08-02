import { cn } from "@/lib/cn";

const tile = {
  sm: "size-8 rounded-[9px] text-[11px]",
  md: "size-9 rounded-[10px] text-[12px]",
  lg: "size-11 rounded-xl text-sm",
};

/**
 * Marca da A3 Sistemas.
 * Mark: tile escuro com "A3" em dourado, anel + brilho sutil (cara de app icon),
 * no lugar do antigo círculo dourado chapado.
 */
export function Logo({
  size = "md",
  showName = true,
  className,
}: {
  size?: keyof typeof tile;
  showName?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden font-mono font-bold tracking-tighter",
          "bg-[linear-gradient(160deg,#18202f,#0b1019)] text-accent ring-1 ring-inset ring-accent/25",
          "shadow-[0_0_22px_-8px_var(--accent-glow)]",
          tile[size],
        )}
      >
        {/* brilho superior */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent" />
        <span className="relative">A3</span>
      </span>
      {showName && (
        <span className="text-[15px] font-semibold tracking-tight text-fg">
          A3 <span className="font-normal text-muted">Sistemas</span>
        </span>
      )}
    </span>
  );
}
