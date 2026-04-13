"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { UndoIcon } from "lucide-react";
import { transactionsAPI } from "@/lib/api-client";
import { toast } from "sonner";

export type TransactionRow = {
  _id: string;
  productId: { _id: string; name: string } | string;
  quantity: number;
  transactionType: "IN" | "OUT";
  performedBy: { _id: string; name: string } | string;
  notes?: string;
  date?: string;
  createdAt?: string;
  isReversal?: boolean;
  reversedBy?: string | null;
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;

      // Don't show undo button for reversal transactions or already undone transactions
      if (transaction.isReversal || transaction.reversedBy) {
        return <span className="text-gray-400">-</span>;
      }

      const handleUndo = async () => {
        if (!confirm(`Are you sure you want to undo this ${transaction.transactionType} transaction of ${transaction.quantity} units? This will create a reverse transaction.`)) {
          return;
        }

        try {
          await transactionsAPI.undo(transaction._id);
          toast.success("Transaction undone successfully");
          // Refresh the page to show updated data
          window.location.reload();
        } catch (error) {
          const err = error as { response?: { data?: { error?: string } } };
          const errorMessage =
            err?.response?.data?.error || "Failed to undo transaction";
          toast.error(errorMessage);
        }
      };

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          className="flex items-center gap-1"
        >
          <UndoIcon className="h-4 w-4" />
          Undo
        </Button>
      );
    },
  },
];
