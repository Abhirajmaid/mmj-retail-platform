"use client";

import { Bell } from "lucide-react";

export default function TopBar({ title, actions }) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell size={18} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
