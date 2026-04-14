import { useState, useEffect, useCallback } from "react";
import {
  productsAPI,
  usersAPI,
  suppliersAPI,
  transactionsAPI,
} from "@/lib/api-client";
import type { ProductRow } from "@/app/dashboard/products/columns";

// ============= PRODUCTS HOOK =============
export function useProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsAPI.getAll();
      setProducts(Array.isArray(data) ? data as ProductRow[] : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const exportProducts = async () => {
    try {
      const response = await productsAPI.export();
      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting products:", err);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct: productsAPI.create,
    updateProduct: productsAPI.update,
    deleteProduct: productsAPI.delete,
    exportProducts,
  };
}

// ============= USERS HOOK =============
export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersAPI.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser: usersAPI.create,
    updateUser: usersAPI.update,
    deleteUser: usersAPI.delete,
  };
}

// ============= SUPPLIERS HOOK =============
export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await suppliersAPI.getAll();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch suppliers");
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const exportSuppliers = async () => {
    try {
      const response = await suppliersAPI.export();
      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suppliers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting suppliers:", err);
      throw err;
    }
  };

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    createSupplier: suppliersAPI.create,
    updateSupplier: suppliersAPI.update,
    deleteSupplier: suppliersAPI.delete,
    exportSuppliers,
  };
}

// ============= TRANSACTIONS HOOK =============
export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionsAPI.getAll();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const exportTransactions = async () => {
    try {
      const response = await transactionsAPI.export();
      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error exporting transactions:", err);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction: transactionsAPI.create,
    updateTransaction: transactionsAPI.update,
    deleteTransaction: transactionsAPI.delete,
    exportTransactions,
  };
}
