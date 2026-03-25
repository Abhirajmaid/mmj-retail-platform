import type { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import { cn } from "../lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Breadcrumb trail; last item is current page (no href). */
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  /** Right-side content: e.g. HELP button, user menu, notifications. */
  actions?: ReactNode;
  className?: string;
}

function DefaultBreadcrumbContent({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) {
  if (isLast) return <span className="font-medium text-zinc-900">{item.label}</span>;
  if (item.href != null) {
    return (
      <a
        href={item.href}
        className="hover:text-zinc-700 focus:rounded focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
      >
        {item.label}
      </a>
    );
  }
  return <span>{item.label}</span>;
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "rounded-[28px] border border-zinc-100  px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06),0_24px_60px_-28px_rgba(15,23,42,0.14)] sm:px-6 sm:py-5",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex flex-wrap items-center gap-1 text-sm text-zinc-500" aria-label="Breadcrumb">
              {breadcrumbs.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />}
                  <DefaultBreadcrumbContent item={item} isLast={i === breadcrumbs.length - 1} />
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-snug text-zinc-500">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex min-h-[44px] flex-shrink-0 flex-wrap items-center gap-2 sm:gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
