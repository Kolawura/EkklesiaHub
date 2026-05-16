import { clsx, type ClassValue } from "clsx";
import { ThumbsUp, Heart, Handshake, Lightbulb } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const REACTIONS = [
  { type: "LIKE", icon: ThumbsUp, label: "Like" },
  { type: "LOVE", icon: Heart, label: "Love" },
  { type: "CLAP", icon: Handshake, label: "Clap" },
  { type: "INSIGHTFUL", icon: Lightbulb, label: "Insightful" },
] as const;

export const REACTION_COLORS: Record<string, string> = {
  LIKE: "bg-gold",
  LOVE: "bg-red-500",
  CLAP: "bg-amber-400",
  INSIGHTFUL: "bg-emerald-500",
};

export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");
export const STATUS_PILL: Record<string, string> = {
  DRAFT: "bg-amber-50 text-amber-700 border border-amber-200",
  ARCHIVED: "bg-parchment-deep text-ink-faint border border-parchment-dark",
};
