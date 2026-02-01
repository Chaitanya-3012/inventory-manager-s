"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ProductRow = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  quantity: number;
  category: string;
  supplierId: { name: string };
  createdBy: { name: string };
  createdAt: string;
};

export const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return category || "N/A";
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("quantity")}</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Selling Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: "costPrice",
    header: "Cost Price",
    cell: ({ row }) => {
      const costPrice = parseFloat(row.getValue("costPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(costPrice);
      return formatted;
    },
  },
  {
    accessorKey: "supplierId.name",
    header: "Supplier",
    cell: ({ row }) => {
      const supplier = row.original.supplierId;
      return supplier?.name || "N/A";
    },
  },
];
