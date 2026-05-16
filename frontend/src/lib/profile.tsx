import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { UsernameState } from "./type";
import { useProfile } from "@/hooks/useProfile";

export const UsernameStatusIcon = () => {
  const { usernameState } = useProfile();
  if (usernameState === "checking")
    return <Loader2 size={14} className="animate-spin text-ink-ghost" />;
  if (usernameState === "available")
    return <CheckCircle2 size={14} className="text-emerald-500" />;
  if (usernameState === "taken")
    return <XCircle size={14} className="text-red-500" />;
  if (usernameState === "unchanged")
    return <CheckCircle2 size={14} className="text-ink-ghost" />;
  return null;
};

export const usernameHint: Record<UsernameState, string> = {
  idle: "",
  checking: "Checking availability…",
  available: "Username is available ✓",
  taken: "That username is already taken",
  invalid: "3–30 characters: letters, numbers, _ and - only",
  unchanged: "This is your current username",
};

export const usernameBorder: Record<UsernameState, string> = {
  idle: "border-parchment-dark",
  checking: "border-gold-pale",
  available: "border-emerald-400",
  taken: "border-red-400",
  invalid: "border-red-400",
  unchanged: "border-parchment-dark",
};
