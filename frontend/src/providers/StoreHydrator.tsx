// src/providers/StoreHydrator.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function StoreHydrator({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
