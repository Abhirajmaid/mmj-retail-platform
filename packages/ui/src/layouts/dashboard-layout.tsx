"use client";

import { useState, type ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  nav?: NavItem[];
  logo?: ReactNode;
  user?: { name: string; email?: string };
}

export function DashboardLayout({ children, nav = [], logo, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform dark:border-zinc-800 dark:bg-zinc-900 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
          {logo ?? <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</span>}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {user && (
          <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.name}</p>
            {user.email && (
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
            )}
          </div>
        )}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
