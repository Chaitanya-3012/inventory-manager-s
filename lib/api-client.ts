import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
axiosInstance.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        `[API Error] ${error.response.status} ${error.config.url}`,
        error.response.data,
      );
    } else if (error.request) {
      // Request made but no response received
      console.error(`[API Error] No response from server: ${error.message}`);
    } else {
      // Error setting up request
      console.error(`[API Error] Request setup failed: ${error.message}`);
    }
    return Promise.reject(error);
  },
);

// ============= PRODUCTS API =============
export const productsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    category: string;
    price: number;
    costPrice: number;
    quantity: number;
    supplierId: string;
    createdBy: string;
  }) => {
    const response = await axiosInstance.post("/products", data);
    return response.data;
  },

  update: async (
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
  ) => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};

// ============= USERS API =============
export const usersAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    email: string;
    role: "admin" | "manager" | "staff";
    department: string;
    password: string;
  }) => {
    const response = await axiosInstance.post("/users", data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "manager" | "staff";
      department?: string;
      password?: string;
    },
  ) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};

// ============= SUPPLIERS API =============
export const suppliersAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/suppliers");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/suppliers/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    paymentTerms?: string;
  }) => {
    const response = await axiosInstance.post("/suppliers", data);
    return response.data;
  },

  update: async (
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
  ) => {
    const response = await axiosInstance.put(`/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/suppliers/${id}`);
    return response.data;
  },
};

// ============= TRANSACTIONS API =============
export const transactionsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get("/transactions");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: {
    productId: string;
    quantity: number;
    transactionType: "IN" | "OUT";
    performedBy: string;
    notes?: string;
  }) => {
    const response = await axiosInstance.post("/transactions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      quantity?: number;
      transactionType?: "IN" | "OUT";
      notes?: string;
    },
  ) => {
    const response = await axiosInstance.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default axiosInstance;
