import { NextResponse } from "next/server";
import { transactionSchema } from "@/lib/validation-schemas";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Transaction, Product, User } from "@/models";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const transactions = await Transaction
    .find({})
    .populate("productId")
    .populate("performedBy");
  return NextResponse.json(transactions);
});

export const POST = withErrorHandling(async (req: Request) => {
  const sanitizedBody = await sanitizeRequestBody(req);
  const body = sanitizedBody as Record<string, unknown>;

  const isAutomated = body.isAutomated === true;
  delete body.isAutomated;

  transactionSchema.parse(body);

  await connectDB();
  const product = await Product.findById(body.productId);
  if (!product) {
    throw new Error("Product not found");
  }
  const currentQty = product.quantity ?? 0;
  const quantity = Number(body.quantity);
  const delta =
    body.transactionType === "IN"
      ? quantity
      : -quantity;
  const newQty = currentQty + delta;
  if (newQty < 0) {
    throw new Error(`Insufficient stock: Product has ${currentQty} units; cannot perform OUT of ${quantity}`);
  }
  const newTransaction = await Transaction.create(body);

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
