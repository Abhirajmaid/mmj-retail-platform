import type { HTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Empty state block with icon, title, description, and optional action.
 * @see https://github.com/Abhirajmaid/xtrawrkx_suits/blob/master/xtrawrkx-crm-portal/src/components/ui/EmptyState.jsx
 */
interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn("px-6 py-12 text-center", className)} {...props}>
      {Icon && (
        <div className="mx-auto mb-4 h-16 w-16 text-gray-400">
          <Icon className="h-full w-full" />
        </div>
      )}
      {title && (
        <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      )}
      {description && (
        <p className="mx-auto mb-6 max-w-md text-gray-500">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
