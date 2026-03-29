import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { productSchema } from "@/lib/validation-schemas";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import "@/models/ProductSchema";
import "@/models/SupplierSchema";
import "@/models/UserSchema";
import "@/models/TransactionSchema";
import { connectDB } from "@/lib/mongodb";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const products = await mongoose
    .model("Product")
    .find({})
    .populate("supplierId", "name email")
    .populate("createdBy", "name email")
    .lean();
  return NextResponse.json(products);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await sanitizeRequestBody(req);

  // Validate the request body
  productSchema.parse(body);

  await connectDB();
  const newProduct = await mongoose.model("Product").create(body);

  // Automatically create an IN transaction for the initial quantity
  if (body.quantity > 0) {
    const Transaction = mongoose.model("Transaction");
    await Transaction.create({
      productId: newProduct._id,
      quantity: body.quantity,
      transactionType: "IN",
      performedBy: body.createdBy,
      notes: "Initial stock creation",
      isAutomated: true,
    });
  }

  await newProduct.populate("supplierId", "name email");
  await newProduct.populate("createdBy", "name email");
  return NextResponse.json(newProduct, { status: 201 });
});
