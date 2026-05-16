import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
}) {
  return (
    <div className="bg-parchment border border-parchment-dark rounded-2xl p-5">
      <div className="w-9 h-9 rounded-xl bg-gold-bg border border-gold-pale flex items-center justify-center text-gold mb-3">
        <Icon size={15} />
      </div>
      <p className="font-display text-[2rem] font-bold text-ink tracking-tight leading-none">
        {value}
      </p>
      <p className="font-body text-xs text-ink-ghost mt-1.5">{label}</p>
      {sub && (
        <p className="font-body text-[10px] text-ink-ghost/70 mt-0.5">{sub}</p>
      )}
    </div>
  );
}
