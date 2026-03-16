"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button, Modal } from "@jewellery-retail/ui";

export interface StockFilters {
  dateFrom: string;
  dateTo: string;
}

interface StockFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: StockFilters) => void;
  appliedFilters: StockFilters;
}

export function StockFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  appliedFilters,
}: StockFilterModalProps) {
  const [filters, setFilters] = useState<StockFilters>({
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFilters({
        dateFrom: appliedFilters.dateFrom || "",
        dateTo: appliedFilters.dateTo || "",
      });
    }
  }, [isOpen, appliedFilters]);

  const handleChange = (key: keyof StockFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const cleared: StockFilters = { dateFrom: "", dateTo: "" };
    setFilters(cleared);
    onApplyFilters(cleared);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Filter Stock" size="md">
      <div className="space-y-4 px-6 pb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Filter className="h-4 w-4" />
          Refine your stock list
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="default" onClick={handleClear}>
            Clear All
          </Button>
          <Button variant="outline" size="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={handleApply}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
}

