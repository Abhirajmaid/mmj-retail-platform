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
      className={`rounded-[28px] border border-zinc-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06),0_24px_60px_-28px_rgba(15,23,42,0.14)] ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 border-b border-zinc-100 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-zinc-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-zinc-700 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 border-t border-zinc-100 pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
