"use client";

import { useState } from "react";
import { ArrowLeftRight, Minus, Plus } from "lucide-react";

import { useStockMovements } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, statusColor } from "@jewellery-retail/utils";

export default function StockPage() {
  const { data } = useStockMovements();
  const [action, setAction] = useState<"add" | "remove" | "transfer" | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock"
        description="Review stock movements and trigger add, remove, or transfer workflows."
        actions={
          <>
            <Button variant="outline" onClick={() => setAction("add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add stock
            </Button>
            <Button variant="outline" onClick={() => setAction("remove")}>
              <Minus className="mr-2 h-4 w-4" />
              Remove stock
            </Button>
            <Button onClick={() => setAction("transfer")}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Transfer stock
            </Button>
          </>
        }
      />

      <Card className="p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Product</TableHeader>
              <TableHeader>Movement</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader className="text-right">Quantity</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-zinc-950">{movement.productName}</p>
                    <p className="text-xs text-zinc-500">{movement.sku}</p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{movement.type}</TableCell>
                <TableCell>{movement.location}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(movement.status)}>{movement.status}</Badge>
                </TableCell>
                <TableCell>{dateFormat(movement.updatedAt)}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">{movement.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        open={Boolean(action)}
        onClose={() => setAction(null)}
        title={action ? `${action.charAt(0).toUpperCase()}${action.slice(1)} stock` : "Stock action"}
      >
        <div className="grid gap-4">
          <Input label="SKU / Barcode" placeholder="Enter product code" />
          <Input label="Quantity" type="number" placeholder="0" />
          <Input label="Location" placeholder="Warehouse or store" />
          {action === "transfer" ? <Input label="Transfer to" placeholder="Destination location" /> : null}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAction(null)}>
              Cancel
            </Button>
            <Button onClick={() => setAction(null)}>Submit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
