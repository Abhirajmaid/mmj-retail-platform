"use client";

import { useMemo, useState } from "react";
import { PencilLine } from "lucide-react";

import type { Product } from "@jewellery-retail/types";
import { useProducts } from "@jewellery-retail/hooks";
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
import { formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function ProductsPage() {
  const { data } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = useMemo(
    () =>
      data.filter((product) => {
        const matchesQuery = `${product.name} ${product.sku} ${product.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [data, query, statusFilter]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Search, filter, and maintain your product catalog from one shared inventory view."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, SKU, category" />
        <select
          className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="low">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
        </select>
      </div>

      <Card className="p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Product</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Supplier</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Stock</TableHeader>
              <TableHeader className="text-right">Price</TableHeader>
              <TableHeader className="text-right">Action</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-zinc-950">{product.name}</p>
                    <p className="text-xs text-zinc-500">{product.sku}</p>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(product.status)}>{product.status.replaceAll("_", " ")}</Badge>
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct ? `Edit ${selectedProduct.name}` : "Edit product"}
      >
        {selectedProduct ? (
          <div className="grid gap-4">
            <Input label="Name" defaultValue={selectedProduct.name} />
            <Input label="SKU" defaultValue={selectedProduct.sku} />
            <Input label="Price" type="number" defaultValue={selectedProduct.price} />
            <Input label="Stock" type="number" defaultValue={selectedProduct.stock} />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Cancel
              </Button>
              <Button onClick={() => setSelectedProduct(null)}>Save changes</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
