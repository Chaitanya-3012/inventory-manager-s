import { useState, useEffect, useCallback } from "react";
import {
  productsAPI,
  usersAPI,
  suppliersAPI,
  transactionsAPI,
} from "@/lib/api-client";
import type { ProductRow } from "@/app/dashboard/columns";

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
      setProducts(Array.isArray(data) ? data : []);
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

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct: productsAPI.create,
    updateProduct: productsAPI.update,
    deleteProduct: productsAPI.delete,
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

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    createSupplier: suppliersAPI.create,
    updateSupplier: suppliersAPI.update,
    deleteSupplier: suppliersAPI.delete,
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

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction: transactionsAPI.create,
    updateTransaction: transactionsAPI.update,
    deleteTransaction: transactionsAPI.delete,
  };
}
