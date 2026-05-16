export function Field({
  id,
  name,
  type,
  label,
  placeholder,
  icon,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-body text-sm font-medium text-ink-light"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          required
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
        />
      </div>
    </div>
  );
}
