"use client";

import { AddSupplierDialog } from "./add-supplier-dialog";
import { supplierColumns, SupplierRow } from "./columns";
import { DataTableEnhanced } from "@/components/data-table/data-table-enhanced";
import { useSuppliers } from "@/hooks/use-api";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

export default function SuppliersPage() {
  const {
    suppliers,
    loading: suppliersLoading,
    error: suppliersError,
    refetch: refetchSuppliers,
    exportSuppliers,
  } = useSuppliers();

  const handleSupplierAdded = () => {
    refetchSuppliers();
  };

  const handleExport = async () => {
    try {
      await exportSuppliers();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <main className="container mx-auto py-8">
      <LoadingOverlay isVisible={suppliersLoading} text="Loading data..." />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddSupplierDialog onSupplierAdded={handleSupplierAdded} />
        </div>
      </div>

      {suppliersError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {suppliersError}
        </div>
      )}

      <DataTableEnhanced
        columns={supplierColumns}
        data={suppliers as SupplierRow[]}
        isLoading={suppliersLoading}
        filterableColumns={[
          { id: "name", title: "Name" },
          { id: "city", title: "City" },
          { id: "country", title: "Country" },
        ]}
      />
    </main>
  );
}
