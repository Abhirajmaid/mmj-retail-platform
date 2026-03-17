"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useFirmStore } from "@/src/store/firm-store";
import { Button, Loader, PageHeader } from "@jewellery-retail/ui";
import { FirmTable } from "@/src/components/firm/FirmTable";
import { FirmKPIs } from "@/src/components/firm/FirmKPIs";
import { Building2, CheckCircle, Clock, Users } from "lucide-react";

export default function FirmPage() {
  const router = useRouter();
  const { firms, deleteFirm, canAddFirm, fetchFirms, loading, error, clearError } =
    useFirmStore();
  const [view, setView] = useState<"gallery" | "list">("gallery");

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const totalFirms = firms.length;
  const activeFirms = firms.filter((f) => f.status === "active").length;
  const pendingReview = firms.filter((f) => f.status === "pending_review").length;
  const selfFirms = firms.filter((f) => f.firmType === "SELF").length;

  const statusStats = [
    {
      label: "Total",
      count: totalFirms,
      icon: Building2,
      color: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      label: "Active",
      count: activeFirms,
      icon: CheckCircle,
      color: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pending",
      count: pendingReview,
      icon: Clock,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
    },
    {
      label: "Self",
      count: selfFirms,
      icon: Users,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="underline">
            Dismiss
          </button>
        </div>
      )}

      <PageHeader
        title="Firm / Branch Management"
        description="Manage all your firms and branches from one place"
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="default"
              className="min-h-[44px] border-amber-200 text-amber-700 hover:bg-amber-50 sm:min-h-9"
              onClick={() => setView(view === "gallery" ? "list" : "gallery")}
            >
              {view === "gallery" ? (
                <>
                  <List className="mr-2 h-4 w-4" />
                  Table View
                </>
              ) : (
                <>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Gallery View
                </>
              )}
            </Button>
            <Button
              className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:w-auto sm:min-h-9"
              disabled={!canAddFirm()}
              asChild
            >
              <Link href="/firm/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Firm
              </Link>
            </Button>
          </div>
        }
      />

      <FirmKPIs statusStats={statusStats} />

      {loading && firms.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-zinc-100/50">
          <Loader size="lg" label="Loading firms" className="h-48" />
        </div>
      ) : (
        <FirmTable
          firms={firms}
          onDelete={deleteFirm}
          activeView={view}
          onViewChange={setView}
          onAddClick={() => router.push("/firm/add")}
        />
      )}
    </div>
  );
}
