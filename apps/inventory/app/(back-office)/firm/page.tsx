"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, LayoutGrid, List, Plus } from "lucide-react";
import { useFirmStore } from "@/src/store/firm-store";
import { Button, PageHeader, StatCard } from "@jewellery-retail/ui";
import { FirmCard } from "@/src/components/firm/FirmCard";
import { FirmTable } from "@/src/components/firm/FirmTable";
import { Building2, CheckCircle, Clock, Users } from "lucide-react";

export default function FirmPage() {
  const { firms, deleteFirm, canAddFirm } = useFirmStore();
  const [view, setView] = useState<"gallery" | "table">("gallery");

  const totalFirms = firms.length;
  const activeFirms = firms.filter((f) => f.status === "active").length;
  const pendingReview = firms.filter((f) => f.status === "pending_review").length;
  const selfFirms = firms.filter((f) => f.firmType === "SELF").length;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {totalFirms >= 2 && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-100 px-4 py-3 text-center text-sm font-semibold text-amber-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          YOU CAN ADD ONLY 2 FIRMS!
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
              onClick={() => setView(view === "gallery" ? "table" : "gallery")}
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

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Firms"
          value={String(totalFirms)}
          description="All firms and branches"
          icon={Building2}
        />
        <StatCard
          title="Active Firms"
          value={String(activeFirms)}
          description="Currently active"
          icon={CheckCircle}
        />
        <StatCard
          title="Pending Review"
          value={String(pendingReview)}
          description="Awaiting review"
          icon={Clock}
        />
        <StatCard
          title="Self Firms"
          value={String(selfFirms)}
          description="Self type only"
          icon={Users}
        />
      </div>

      {view === "gallery" ? (
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {firms.map((firm) => (
            <FirmCard key={firm.id} firm={firm} onDelete={deleteFirm} />
          ))}
          {firms.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center text-zinc-500">
              No firms yet. Click &quot;Add Firm&quot; to create one.
            </div>
          )}
        </div>
      ) : (
        <FirmTable firms={firms} onDelete={deleteFirm} />
      )}
    </div>
  );
}
