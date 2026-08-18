import { cn } from "@/lib/cn";

const markSize = { sm: "size-7", md: "size-8", lg: "size-10" };
const textSize = { sm: "text-sm", md: "text-[15px]", lg: "text-lg" };

/**
 * Marca Zkode — hexágono com losango central.
 * Cores fixas (roxo/rosa) por padrão — usadas no painel. Passe `stroke`/`fill`
 * para recolorir em superfícies com identidade própria (ex.: landing metalizada).
 */
export function ZkodeMark({
  className,
  stroke = "#8B5CF6",
  fill = "#EC4899",
}: {
  className?: string;
  stroke?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 8.4 L16.2 11 L12 13.6 L7.8 11 Z" fill={fill} />
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
