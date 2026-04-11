"use client";

import * as React from "react";
import { transactionColumns, TransactionRow } from "./columns";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { DataTableEnhanced } from "@/components/data-table/data-table-enhanced";
import { useProducts, useTransactions, useUsers } from "@/hooks/use-api";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export default function TransactionsPage() {
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
    exportTransactions,
  } = useTransactions();
  const { products, loading: productsLoading } = useProducts();
  const { users, loading: usersLoading } = useUsers();

  const isLoading = transactionsLoading || productsLoading || usersLoading;

  const productsForTransaction = React.useMemo(
    () => products.map((p) => ({ _id: p._id, name: p.name })),
    [products],
  );

  const handleTransactionAdded = () => {
    refetchTransactions();
  };

  const handleExport = async () => {
    try {
      await exportTransactions();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <main className="container mx-auto py-8">
      <LoadingOverlay isVisible={isLoading} text="Loading data..." />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddTransactionDialog
            onTransactionAdded={handleTransactionAdded}
            products={productsForTransaction}
            users={users.map((u) => ({ _id: u._id, name: u.name }))}
          />
        </div>
      </div>

      {transactionsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {transactionsError}
        </div>
      )}

      <DataTableEnhanced
        columns={transactionColumns}
        data={transactions as TransactionRow[]}
        isLoading={isLoading}
        filterableColumns={[
          { id: "productId", title: "Product" },
          { id: "transactionType", title: "Type" },
          { id: "performedBy", title: "Performed By" },
        ]}
      />
    </main>
  );
}
