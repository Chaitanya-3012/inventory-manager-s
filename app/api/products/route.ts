import { NextResponse } from "next/server";
import { z } from "zod";
import { productSchema } from "@/lib/validation-schemas";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Product, Transaction } from "@/models";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const products = await Product
    .find({})
    .populate("supplierId", "name email")
    .populate("createdBy", "name email")
    .lean();
  return NextResponse.json(products);
});

export const POST = withErrorHandling(async (req: Request) => {
  const rawData = await sanitizeRequestBody(req);
  const body = productSchema.parse(rawData);

  await connectDB();
  const newProduct = await Product.create(body);

  if (body.quantity > 0) {
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
