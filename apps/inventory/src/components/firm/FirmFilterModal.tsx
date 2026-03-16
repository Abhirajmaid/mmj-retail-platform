"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button, Modal } from "@jewellery-retail/ui";
import { FIRM_TYPE_OPTIONS } from "@/src/types/firm";

export interface FirmFilters {
  status: string;
  firmType: string;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending_review", label: "Pending Review" },
  { value: "inactive", label: "Inactive" },
];

interface FirmFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FirmFilters) => void;
  appliedFilters: FirmFilters;
}

export function FirmFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  appliedFilters,
}: FirmFilterModalProps) {
  const [filters, setFilters] = useState<FirmFilters>({
    status: "",
    firmType: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFilters({
        status: appliedFilters.status || "",
        firmType: appliedFilters.firmType || "",
      });
    }
  }, [isOpen, appliedFilters]);

  const handleChange = (key: keyof FirmFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const cleared: FirmFilters = { status: "", firmType: "" };
    setFilters(cleared);
    onApplyFilters(cleared);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Filter Firms" size="md">
      <div className="space-y-4 px-6 pb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Filter className="h-4 w-4" />
          Refine your firm list
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Firm Type
            </label>
            <select
              value={filters.firmType}
              onChange={(e) => handleChange("firmType", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            >
              <option value="">All Types</option>
              {FIRM_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="default" onClick={handleClear}>
            Clear All
          </Button>
          <Button variant="outline" size="default" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" size="default" onClick={handleApply} className="bg-amber-500 hover:bg-amber-600">
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
}
