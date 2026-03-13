import type { ElementType, HTMLAttributes } from "react";

type Spacing = "none" | "sm" | "md" | "lg" | "xl";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: Spacing;
  as?: ElementType;
}

const spacingClasses: Record<Spacing, string> = {
  none: "",
  sm: "py-6",
  md: "py-12",
  lg: "py-16",
  xl: "py-24",
};

export function Section({ children, className = "", spacing = "md", as: Tag = "section", ...props }: SectionProps) {
  return (
    <Tag className={`${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
