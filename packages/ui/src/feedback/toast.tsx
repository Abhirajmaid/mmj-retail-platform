"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type ToastVariant = "default" | "success" | "warning" | "error";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClasses: Record<ToastVariant, string> = {
  default: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  error: "bg-red-600 text-white",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [toast, onRemove]);

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium ${variantClasses[toast.variant]}`}
      role="alert"
    >
      <span>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 shrink-0 opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, variant: ToastVariant = "default", duration = 4000) => {
    const id = String(++counter.current);
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
