import type { HTMLAttributes } from "react";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: MaxWidth;
}

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export function Container({ children, className = "", maxWidth = "xl", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
