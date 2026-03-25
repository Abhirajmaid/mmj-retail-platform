"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { usePurchaseOrders } from "@jewellery-retail/hooks";
import { Badge, Button, PageHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@jewellery-retail/ui";
import { dateFormat, statusColor } from "@jewellery-retail/utils";

export default function ApprovePurchaseOrdersInboxPage() {
  const router = useRouter();
  const { data } = usePurchaseOrders();

  const pendingPOs = useMemo(() => {
    // Show all pending POs (draft + in_transit). Clicking a PO opens the approve confirmation page.
    return (data ?? []).filter((po) => po.status !== "approved");
  }, [data]);

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Approve PO"
        description="Pending purchase orders. Click a PO number to approve."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/purchase-orders")}
          >
            Back to list
          </Button>
        }
      />

      <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <Table className="min-w-[980px] table-fixed">
          <TableHead>
            <TableRow>
              <TableHeader className="w-[20%] min-w-0">PO NUMBER</TableHeader>
              <TableHeader className="w-[24%] min-w-0">SUPPLIER</TableHeader>
              <TableHeader className="w-[14%] min-w-0">STATUS</TableHeader>
              <TableHeader className="w-[18%] min-w-0">CREATED</TableHeader>
              <TableHeader className="w-[18%] min-w-0">EXPECTED DELIVERY</TableHeader>
              <TableHeader className="w-[6%] min-w-0">ITEMS</TableHeader>
              <TableHeader className="w-[12%] min-w-0 text-right">TOTAL</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingPOs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-zinc-500">
                  No pending purchase orders found.
                </TableCell>
              </TableRow>
            ) : (
              pendingPOs.map((po) => (
                <TableRow
                  key={po.id}
                  className="cursor-pointer border-b border-zinc-100 bg-white hover:bg-amber-50"
                  onClick={() => router.push(`/purchase-orders/approve/${po.id}`)}
                  role="button"
                >
                  <TableCell className="py-2 pl-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-zinc-950">{po.poNumber}</span>
                      <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700 truncate" title={po.supplierName}>
                    {po.supplierName}
                  </TableCell>
                  <TableCell className="py-2 text-left">
                    <Badge variant={statusColor(po.status)}>{po.status.replaceAll("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700">{dateFormat(po.createdAt)}</TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700">{dateFormat(po.expectedDate)}</TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700">{po.items}</TableCell>
                  <TableCell className="py-2 pr-4 text-right font-medium text-zinc-950">{po.total}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

