"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-zinc-300 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-500"
        } ${className}`}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
