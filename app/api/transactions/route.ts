import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { transactionSchema } from "@/lib/validation-schemas";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import { connectDB } from "@/lib/mongodb";
import "@/models/TransactionSchema";
import "@/models/ProductSchema";
import "@/models/UserSchema";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const transactions = await mongoose
    .model("Transaction")
    .find({})
    .populate("productId")
    .populate("performedBy");
  return NextResponse.json(transactions);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await sanitizeRequestBody(req);

  const isAutomated = body.isAutomated === true;
  delete body.isAutomated;

  transactionSchema.parse(body);

  await connectDB();
  const Product = mongoose.model("Product");
  const product = await Product.findById(body.productId);
  if (!product) {
    throw new Error("Product not found");
  }
  const currentQty = product.quantity ?? 0;
  const delta =
    body.transactionType === "IN"
      ? body.quantity
      : -body.quantity;
  const newQty = currentQty + delta;
  if (newQty < 0) {
    throw new Error(`Insufficient stock: Product has ${currentQty} units; cannot perform OUT of ${body.quantity}`);
  }
  const newTransaction = await mongoose
    .model("Transaction")
    .create(body);

  if (!isAutomated) {
    await Product.findByIdAndUpdate(body.productId, {
      quantity: newQty,
      updatedAt: new Date(),
    });
  }

  await newTransaction.populate("productId");
  await newTransaction.populate("performedBy", "name email");
  return NextResponse.json(newTransaction, { status: 201 });
});
