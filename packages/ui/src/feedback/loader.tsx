import type { HTMLAttributes } from "react";
import { Icon } from "@iconify/react";

import { cn } from "../lib/utils";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: LoaderSize;
  label?: string;
}

const sizeMap: Record<LoaderSize, number> = {
  sm: 24,
  md: 40,
  lg: 50,
};

export function Loader({
  size = "lg",
  label = "Loading...",
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      role="status"
      className={cn("text-primary w-full h-[50vh] flex justify-center items-center", className)}
      {...props}
    >
      <Icon icon="svg-spinners:180-ring" width={sizeMap[size]} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader size="lg" className="h-full" />
    </div>
  );
}
