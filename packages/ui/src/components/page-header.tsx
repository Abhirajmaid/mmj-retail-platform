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
    <div className={cn("flex flex-col gap-4 pb-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--app-accent,#f97316)]">
          Workspace overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-zinc-500">{description}</p> : null}
        </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
