import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ children, className = "", ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table
        className={`w-full border-collapse text-sm text-zinc-700 dark:text-zinc-300 ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-zinc-100 dark:divide-zinc-800 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-3 text-left ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 ${className}`} {...props}>
      {children}
    </td>
  );
}
