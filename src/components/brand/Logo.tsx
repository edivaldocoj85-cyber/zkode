import { cn } from "@/lib/cn";

const markSize = { sm: "size-7", md: "size-8", lg: "size-10" };
const textSize = { sm: "text-sm", md: "text-[15px]", lg: "text-lg" };

/** Marca Zkode — hexágono roxo com losango rosa. */
export function ZkodeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 8.4 L16.2 11 L12 13.6 L7.8 11 Z" fill="#EC4899" />
    </svg>
  );
}

/**
 * Logo Zkode: mark + wordmark "Zkode".
 * O texto usa currentColor — o container define a cor conforme o fundo.
 */
export function Logo({
  size = "md",
  showName = true,
  className,
}: {
  size?: keyof typeof markSize;
  showName?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <ZkodeMark className={markSize[size]} />
      {showName && (
        <span className={cn("font-semibold tracking-tight", textSize[size])}>
          Zkode
        </span>
      )}
    </span>
  );
}
