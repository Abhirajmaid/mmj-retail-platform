import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className = "", padding = "md", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 border-b border-zinc-200 pb-4 dark:border-zinc-800 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-zinc-900 dark:text-zinc-100 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-zinc-700 dark:text-zinc-300 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800 ${className}`} {...props}>
      {children}
    </div>
  );
}
