import { cn } from "@/lib/utils";

export function CrossOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("shrink-0", className)}
      fill="currentColor"
      aria-hidden
    >
      <rect x="17" y="4" width="6" height="32" rx="1" />
      <rect x="4" y="14" width="32" height="6" rx="1" />
    </svg>
  );
}

export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <div className="h-px bg-gold-pale/60 w-24" />
      <CrossOrnament className="w-4 h-4 text-gold/40" />
      <div className="h-px bg-gold-pale/60 w-24" />
    </div>
  );
}
