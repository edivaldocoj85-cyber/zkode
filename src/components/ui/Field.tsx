import { cn } from "@/lib/cn";

const baseInput =
  "h-10 w-full rounded-xl border border-border bg-surface-2/60 px-3 text-sm text-fg placeholder:text-subtle transition-colors focus:border-accent/50 focus:bg-surface-2 focus:outline-none";

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted">
      {children}
      {hint && <span className="font-normal text-subtle">· {hint}</span>}
    </label>
  );
}

export function TextField({
  label,
  hint,
  id,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <input id={id} className={baseInput} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  id,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={cn(baseInput, "cursor-pointer appearance-none pr-8")} {...props}>
        {children}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  id,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        className={cn(baseInput, "min-h-[84px] resize-y py-2.5 leading-relaxed")}
        {...props}
      />
    </div>
  );
}
