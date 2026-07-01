// src/providers/StoreHydrator.tsx  (new file)
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function StoreHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
