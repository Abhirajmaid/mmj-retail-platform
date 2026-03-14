import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border border-zinc-200 bg-white/80 text-zinc-700",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border border-amber-200 bg-amber-50 text-amber-700",
  danger: "border border-red-200 bg-red-50 text-red-700",
  info: "border border-orange-200 bg-orange-50 text-orange-700",
};

export function Badge({ children, className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
