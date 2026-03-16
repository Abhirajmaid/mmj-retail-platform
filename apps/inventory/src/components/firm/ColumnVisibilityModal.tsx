"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button, Modal } from "@jewellery-retail/ui";

export interface ColumnOption {
  key: string;
  label: string;
}

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnOption[];
  visibleColumns: string[];
  onVisibilityChange: (visibleKeys: string[]) => void;
}

export function ColumnVisibilityModal({
  isOpen,
  onClose,
  columns,
  visibleColumns,
  onVisibilityChange,
}: ColumnVisibilityModalProps) {
  const [localVisibility, setLocalVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, boolean> = {};
      columns.forEach((col) => {
        initial[col.key] = visibleColumns.includes(col.key);
      });
      setLocalVisibility(initial);
    }
  }, [isOpen, columns, visibleColumns]);

  const handleToggle = (columnKey: string) => {
    const next = { ...localVisibility, [columnKey]: !localVisibility[columnKey] };
    setLocalVisibility(next);
    const newVisible = columns.map((c) => c.key).filter((key) => next[key] === true);
    onVisibilityChange(newVisible);
  };

  const handleReset = () => {
    const allTrue: Record<string, boolean> = {};
    columns.forEach((col) => {
      allTrue[col.key] = true;
    });
    setLocalVisibility(allTrue);
    onVisibilityChange(columns.map((c) => c.key));
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Column Visibility" size="md">
      <div className="space-y-4 px-6 pb-6">
        <p className="text-sm text-zinc-500">Show or hide columns in the table</p>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 py-2"
            >
              <span className="text-sm font-medium text-zinc-700">{column.label}</span>
              <button
                type="button"
                onClick={() => handleToggle(column.key)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  localVisibility[column.key]
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300"
                }`}
              >
                {localVisibility[column.key] ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hidden
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="default" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="default" size="default" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
