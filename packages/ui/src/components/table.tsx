import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export function Table({ children, className = "", ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200/80  shadow-md transition-shadow duration-300 backdrop-blur-xl">
      <table className={cn("w-full min-w-full table-auto overflow-hidden rounded-lg border-collapse text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-orange-200/70 bg-gray-300/30 shadow-sm backdrop-blur-lg",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-zinc-100  backdrop-blur-sm", className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-zinc-100/80 transition-all duration-300 group last:border-b-0",
        "hover:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-gray-800",
        "first:rounded-tl-lg last:rounded-tr-lg shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-6 py-4 text-sm text-gray-800 transition-colors duration-300 group-hover:text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
