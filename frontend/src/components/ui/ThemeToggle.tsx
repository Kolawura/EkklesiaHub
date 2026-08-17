"use client";

import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";

export type ThemeName =
  | "sacred"
  | "light"
  | "dark"
  | "midnight"
  | "sepia"
  | "forest"
  | "rose"
  | "papyrus"
  | "obsidian"
  | "byzantine";

const THEME_META: Record<ThemeName, { label: string; swatch: string }> = {
  sacred: { label: "Sacred Editorial", swatch: "#b87d2c" },
  light: { label: "Light", swatch: "#b8752a" },
  dark: { label: "Dark", swatch: "#d4a255" },
  midnight: { label: "Midnight", swatch: "#60a5fa" },
  sepia: { label: "Sepia", swatch: "#9c5a1a" },
  forest: { label: "Forest", swatch: "#4c7a3f" },
  rose: { label: "Rose Quartz", swatch: "#b8514a" },
  papyrus: { label: "Papyrus", swatch: "#c1552a" },
  obsidian: { label: "Obsidian", swatch: "#e0b64a" },
  byzantine: { label: "Byzantine", swatch: "#8b5a9e" },
};

const THEME_ORDER: ThemeName[] = [
  "sacred",
  "light",
  "dark",
  "midnight",
  "sepia",
  "forest",
  "rose",
  "papyrus",
  "obsidian",
  "byzantine",
];

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!mounted) return null;

  const current = (theme as ThemeName) ?? "light";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`p-1.5 text-ink-ghost hover:text-ink hover:bg-parchment-deep rounded-lg transition-colors ${className}`}
        title={`Theme: ${THEME_META[current]?.label ?? "Light"}`}
      >
        <Palette size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-parchment border border-parchment-dark rounded-lg shadow-lg py-1.5 z-5000000">
          {THEME_ORDER.map((name) => {
            const meta = THEME_META[name];
            const active = current === name;
            return (
              <button
                key={name}
                onClick={() => {
                  setTheme(name);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm font-body text-ink hover:bg-parchment-deep transition-colors text-left"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-parchment-dark shrink-0"
                  style={{ backgroundColor: meta.swatch }}
                />
                <span className="flex-1">{meta.label}</span>
                {active && <Check size={13} className="text-gold shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}