"use client";

import { CheckCircle2, ClipboardPlus, Truck } from "lucide-react";

import { usePurchaseOrders } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function PurchaseOrdersPage() {
  const { data } = usePurchaseOrders();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase orders"
        description="Create, approve, and track incoming purchase orders with suppliers."
        actions={
          <>
            <Button variant="outline">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve PO
            </Button>
            <Button>
              <ClipboardPlus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </>
        }
      />

      <Card className="p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>PO number</TableHeader>
              <TableHeader>Supplier</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Expected delivery</TableHeader>
              <TableHeader>Items</TableHeader>
              <TableHeader className="text-right">Total</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((purchaseOrder) => (
              <TableRow key={purchaseOrder.id}>
                <TableCell className="font-medium text-zinc-950">{purchaseOrder.poNumber}</TableCell>
                <TableCell>{purchaseOrder.supplierName}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(purchaseOrder.status)}>
                    {purchaseOrder.status.replaceAll("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{dateFormat(purchaseOrder.createdAt)}</TableCell>
                <TableCell>{dateFormat(purchaseOrder.expectedDate)}</TableCell>
                <TableCell>{purchaseOrder.items}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">
                  {formatCurrency(purchaseOrder.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-zinc-700" />
            <div>
              <p className="font-medium text-zinc-950">Track delivery</p>
              <p className="text-sm text-zinc-500">Follow in-transit POs and ETA exceptions.</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <p className="font-medium text-zinc-950">Supplier readiness</p>
          <p className="mt-2 text-sm text-zinc-500">Use open PO counts and on-time rates to balance vendor allocation.</p>
        </Card>
        <Card className="p-5">
          <p className="font-medium text-zinc-950">Approval workflow</p>
          <p className="mt-2 text-sm text-zinc-500">Shared UI components keep PO review flows consistent across apps.</p>
        </Card>
      </div>
    </div>
  );
}
