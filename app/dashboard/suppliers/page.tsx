"use client";

import { AddSupplierDialog } from "./add-supplier-dialog";
import { supplierColumns, SupplierRow } from "./columns";
import { DataTable } from "@/components/data-table";
import { useSuppliers } from "@/hooks/use-api";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function SuppliersPage() {
  const {
    suppliers,
    loading: suppliersLoading,
    error: suppliersError,
    refetch: refetchSuppliers,
  } = useSuppliers();

  const handleSupplierAdded = () => {
    refetchSuppliers();
  };

  return (
    <main className="container mx-auto py-8">
      <LoadingOverlay isVisible={suppliersLoading} text="Loading data..." />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <AddSupplierDialog onSupplierAdded={handleSupplierAdded} />
      </div>

      {suppliersError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {suppliersError}
        </div>
      )}

      <DataTable
        columns={supplierColumns}
        data={suppliers as SupplierRow[]}
        isLoading={false}
      />
    </main>
  );
}
