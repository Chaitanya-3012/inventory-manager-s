const API_BASE = "/api";

type RequestOptions = Omit<RequestInit, "body"> & { body?: object };

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const method = (options.method || "GET").toUpperCase();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const hasBody = options.body != null && options.method !== "GET";
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
    signal: controller.signal,
  });

  clearTimeout(timeout);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed: ${res.status}`) as Error & {
      response?: { status: number; data?: unknown };
    };
    err.response = { status: res.status, data };
    throw err;
  }

  return data as T;
}

// ============= PRODUCTS API =============
export const productsAPI = {
  getAll: () => request<unknown[]>("/products"),
  getById: (id: string) => request<unknown>(`/products/${id}`),
  create: (data: {
    name: string;
    description?: string;
    category: string;
    price: number;
    costPrice: number;
    quantity: number;
    supplierId: string;
    createdBy: string;
  }) => request<unknown>("/products", { method: "POST", body: data }),
  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      price?: number;
      costPrice?: number;
      quantity?: number;
      supplierId?: string;
    },
  ) => request<unknown>(`/products/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    request<unknown>(`/products/${id}`, { method: "DELETE" }),
  export: () => {
    const url = `${API_BASE}/products/export`;
    return fetch(url, { method: "GET" });
  },
};

// ============= USERS API =============
export const usersAPI = {
  getAll: () => request<unknown[]>("/users"),
  getById: (id: string) => request<unknown>(`/users/${id}`),
  create: (data: {
    name: string;
    email: string;
    role: "admin" | "manager" | "staff";
    department: string;
    password: string;
  }) => request<unknown>("/users", { method: "POST", body: data }),
  update: (
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "manager" | "staff";
      department?: string;
      password?: string;
    },
  ) => request<unknown>(`/users/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    request<unknown>(`/users/${id}`, { method: "DELETE" }),
};

// ============= SUPPLIERS API =============
export const suppliersAPI = {
  getAll: () => request<unknown[]>("/suppliers"),
  getById: (id: string) => request<unknown>(`/suppliers/${id}`),
  create: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    paymentTerms?: string;
  }) => request<unknown>("/suppliers", { method: "POST", body: data }),
  update: (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      paymentTerms?: string;
    },
  ) => request<unknown>(`/suppliers/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    request<unknown>(`/suppliers/${id}`, { method: "DELETE" }),
  export: () => {
    const url = `${API_BASE}/suppliers/export`;
    return fetch(url, { method: "GET" });
  },
};

// ============= TRANSACTIONS API =============
export const transactionsAPI = {
  getAll: () => request<unknown[]>("/transactions"),
  getById: (id: string) => request<unknown>(`/transactions/${id}`),
  create: (data: {
    productId: string;
    quantity: number;
    transactionType: "IN" | "OUT";
    performedBy: string;
    notes?: string;
  }) =>
    request<unknown>("/transactions", { method: "POST", body: data }),
  update: (
    id: string,
    data: {
      quantity?: number;
      transactionType?: "IN" | "OUT";
      notes?: string;
    },
  ) =>
    request<unknown>(`/transactions/${id}`, { method: "PUT", body: data }),
  delete: (id: string) =>
    request<unknown>(`/transactions/${id}`, { method: "DELETE" }),
  undo: (id: string) =>
    request<unknown>(`/transactions/${id}/undo`, { method: "POST" }),
  export: () => {
    const url = `${API_BASE}/transactions/export`;
    return fetch(url, { method: "GET" });
  },
};
