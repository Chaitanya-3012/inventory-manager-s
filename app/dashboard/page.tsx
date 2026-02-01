"use client";

import * as React from "react";
import { columns, ProductRow } from "./columns";
import { DataTable } from "./data-table";
import { AddProductDialog } from "./add-product-dialog";

export default function ProductsPage() {
  const [products, setProducts] = React.useState<ProductRow[]>([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, []);

  const fetchSuppliers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/suppliers");
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  }, []);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchSuppliers(), fetchUsers()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchProducts, fetchSuppliers, fetchUsers]);

  const handleProductAdded = () => {
    fetchProducts();
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <AddProductDialog
          onProductAdded={handleProductAdded}
          suppliers={suppliers}
          users={users}
        />
      </div>

      <DataTable columns={columns} data={products} isLoading={isLoading} />
    </main>
  );
}
