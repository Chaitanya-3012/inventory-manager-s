"use client";

import * as React from "react";
import { columns, ProductRow } from "./columns";
import { AddProductDialog } from "./add-product-dialog";
import { DataTable } from "@/components/data-table";
import { useProducts, useSuppliers, useUsers } from "@/hooks/use-api";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function ProductsPage() {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();
  const { suppliers, loading: suppliersLoading } = useSuppliers();
  const { users, loading: usersLoading } = useUsers();

  const isLoading = productsLoading || suppliersLoading || usersLoading;

  const handleProductAdded = () => {
    refetchProducts();
  };

  return (
    <main className="container mx-auto py-8">
      <LoadingOverlay isVisible={isLoading} text="Loading data..." />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <AddProductDialog
          onProductAdded={handleProductAdded}
          suppliers={suppliers.map((s) => ({ _id: s._id, name: s.name }))}
          users={users.map((u) => ({ _id: u._id, name: u.name }))}
        />
      </div>

      {productsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {productsError}
        </div>
      )}

      <DataTable
        columns={columns}
        data={products as ProductRow[]}
        isLoading={false}
      />
    </main>
  );
}
