"use client";

import * as React from "react";
import { transactionColumns, TransactionRow } from "./columns";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { DataTable } from "@/components/data-table";
import { useProducts, useTransactions, useUsers } from "@/hooks/use-api";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function TransactionsPage() {
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
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

  return (
    <main className="container mx-auto py-8">
      <LoadingOverlay isVisible={isLoading} text="Loading data..." />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <AddTransactionDialog
          onTransactionAdded={handleTransactionAdded}
          products={productsForTransaction}
          users={users.map((u) => ({ _id: u._id, name: u.name }))}
        />
      </div>

      {transactionsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {transactionsError}
        </div>
      )}

      <DataTable
        columns={transactionColumns}
        data={transactions as TransactionRow[]}
        isLoading={false}
      />
    </main>
  );
}
