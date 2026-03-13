import type { HTMLAttributes } from "react";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: LoaderSize;
  label?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export function Loader({ size = "md", label = "Loading…", className = "", ...props }: LoaderProps) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      {...props}
    >
      <div
        className={`animate-spin rounded-full border-zinc-200 border-t-zinc-700 dark:border-zinc-700 dark:border-t-zinc-300 ${sizeClasses[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
