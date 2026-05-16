"use client";

import { useToast } from "@/hooks/useToast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm animate-in slide-in-from-bottom-2 duration-200 ${
            toast.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200"
              : toast.variant === "success"
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200"
              : "bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.variant === "destructive" ? (
              <AlertCircle size={16} />
            ) : toast.variant === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <Info size={16} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="font-semibold leading-snug">{toast.title}</p>
            )}
            {toast.description && (
              <p className="mt-0.5 opacity-90 leading-snug">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
