import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

export function PasswordInput({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 pr-10 font-body text-sm bg-parchment border border-parchment-dark rounded-lg text-ink outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink-faint transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}
