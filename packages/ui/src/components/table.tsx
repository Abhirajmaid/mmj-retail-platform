import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ children, className = "", ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-[24px] bg-transparent">
      <table
        className={`w-full border-collapse text-sm text-zinc-700 ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-zinc-50/80 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-zinc-100 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`transition hover:bg-orange-50/40 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-5 py-4 text-left ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </td>
  );
}
