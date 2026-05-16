"use client";

import { useState, useCallback, useEffect } from "react";

type ToastVariant = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastInput = Omit<Toast, "id">;

// Global state so toast() can be called from anywhere
let globalToasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const notify = () => listeners.forEach((l) => l([...globalToasts]));

export const toast = (input: ToastInput) => {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = { id, duration: 4000, variant: "default", ...input };
  globalToasts = [...globalToasts, newToast];
  notify();

  setTimeout(() => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notify();
  }, newToast.duration);
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notify();
  }, []);

  return { toasts, dismiss };
};
