import { EyeOff, Eye, Lock } from "lucide-react";

export function PasswordField({
  id,
  name,
  label,
  placeholder,
  show,
  onToggle,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
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
          <Lock size={14} />
        </span>
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          required
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink-faint transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}
