"use client";

import { Bell, Search } from "lucide-react";

export default function TopBar({ title }) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell size={18} className="text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search size={15} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </header>
  );
}
