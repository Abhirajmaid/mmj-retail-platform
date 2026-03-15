import type { ReactNode } from "react";

import { cn } from "../lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-4 pb-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-accent,#f97316)] sm:text-xs sm:tracking-[0.28em]">
          Workspace overview
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">{title}</h1>
        {description ? <p className="max-w-2xl text-sm leading-snug text-zinc-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">{actions}</div> : null}
    </div>
  );
}
