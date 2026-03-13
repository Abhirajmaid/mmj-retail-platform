import type { HTMLAttributes } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function getInitials(initials?: string, alt?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase();
  if (alt) {
    return alt
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return "?";
}

export function Avatar({ src, alt, initials, size = "md", className = "", ...props }: AvatarProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 ${sizeClass} ${className}`}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
          {getInitials(initials, alt)}
        </span>
      )}
    </div>
  );
}
