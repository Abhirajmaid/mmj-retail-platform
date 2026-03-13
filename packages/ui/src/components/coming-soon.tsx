import type { HTMLAttributes } from "react";

import { cn } from "../lib/utils";

interface ComingSoonProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing. Stay tuned!",
  className,
  ...props
}: ComingSoonProps) {
  return (
    <div
      className={cn(
        "min-h-[90vh] bg-bg flex flex-col items-center justify-center px-4 text-center",
        className
      )}
      {...props}
    >
      <h1 className="mb-8 text-5xl font-bold text-black animate-pulse">
        {title}
      </h1>
      <p className="text-lg text-black">{description}</p>
    </div>
  );
}
