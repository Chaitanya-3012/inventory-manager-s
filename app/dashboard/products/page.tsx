"use client";

import * as React from "react";
import { columns, ProductRow } from "./columns";
import { AddProductDialog } from "./add-product-dialog";
import { DataTableEnhanced } from "@/components/data-table/data-table-enhanced";
import { useProducts, useSuppliers, useUsers } from "@/hooks/use-api";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export default function ProductsPage() {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
    exportProducts,
  } = useProducts();
  const { suppliers, loading: suppliersLoading } = useSuppliers();
  const { users, loading: usersLoading } = useUsers();

  const isLoading = productsLoading || suppliersLoading || usersLoading;

  const handleProductAdded = () => {
    refetchProducts();
  };

  const handleExport = async () => {
    try {
      await exportProducts();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <main className="container mx-auto py-8">
      <LoadingOverlay isVisible={isLoading} text="Loading data..." />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddProductDialog
            onProductAdded={handleProductAdded}
            suppliers={suppliers.map((s) => ({ _id: s._id, name: s.name }))}
            users={users.map((u) => ({ _id: u._id, name: u.name }))}
          />
        </div>
      </div>

      {productsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {productsError}
        </div>
      )}

      <DataTableEnhanced
        columns={columns}
        data={products as ProductRow[]}
        isLoading={isLoading}
        filterableColumns={[
          { id: "name", title: "Name" },
          { id: "category", title: "Category" },
          { id: "supplierId.name", title: "Supplier" },
        ]}
      />
    </main>
  );
}
