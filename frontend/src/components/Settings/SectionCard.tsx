export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
      <h2 className="font-display text-[1.0625rem] font-semibold text-ink mb-1">
        {title}
      </h2>
      <p className="font-body text-sm text-ink-faint mb-5 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}
