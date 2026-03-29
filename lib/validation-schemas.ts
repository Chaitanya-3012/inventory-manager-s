import { z } from "zod";

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  category: z.string().min(5).max(100),
  price: z.number().positive(),
  costPrice: z.number().positive(),
  quantity: z.number().nonnegative(),
  supplierId: z.string().length(24, "Invalid supplier ID"),
  createdBy: z.string().length(24, "Invalid user ID"),
});

// Partial product schema for updates
export const productUpdateSchema = productSchema.partial();

// Supplier validation schema
export const supplierSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  paymentTerms: z.string().optional(),
});

// Partial supplier schema for updates
export const supplierUpdateSchema = supplierSchema.partial();

// User validation schema
export const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "staff"]),
  department: z.string().min(2).max(100),
  password: z.string().min(6),
});

// Partial user schema for updates
export const userUpdateSchema = userSchema.partial();

// Transaction validation schema
export const transactionSchema = z.object({
  productId: z.string().length(24, "Invalid product ID"),
  quantity: z.number().positive(),
  transactionType: z.enum(["IN", "OUT"]),
  performedBy: z.string().length(24, "Invalid user ID"),
  notes: z.string().optional(),
  isAutomated: z.boolean().optional(),
});

// Partial transaction schema for updates
export const transactionUpdateSchema = transactionSchema.partial();

// ID validation schema
export const idSchema = z.object({
  id: z.string().length(24, "Invalid ID"),
});