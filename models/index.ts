// Import all models to ensure they're registered with Mongoose
import { User } from "./UserSchema";
import { Session } from "./Session";
import { Supplier } from "./SupplierSchema";
import { Product } from "./ProductSchema";
import { Transaction } from "./TransactionSchema";

// Export models for direct import when needed
export { User, Session, Supplier, Product, Transaction };