"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TransactionRow = {
  _id: string;
  productId: { _id: string; name: string } | string;
  quantity: number;
  transactionType: "IN" | "OUT";
  performedBy: { _id: string; name: string } | string;
  notes?: string;
  date?: string;
  createdAt?: string;
};

export const transactionColumns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: "productId",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original.productId;
      const name =
        typeof product === "object" && product !== null && "name" in product
          ? (product as { name: string }).name
          : "N/A";
      return name;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("quantity")}</span>
    ),
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;
      return (
        <span
          className={
            type === "IN"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "performedBy",
    header: "Performed By",
    cell: ({ row }) => {
      const user = row.original.performedBy;
      const name =
        typeof user === "object" && user !== null && "name" in user
          ? (user as { name: string }).name
          : "N/A";
      return name;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string | undefined;
      return notes || "-";
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string | undefined;
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },
  },
];
