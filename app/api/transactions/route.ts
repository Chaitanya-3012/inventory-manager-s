import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import "@/models/TransactionSchema";
import "@/models/ProductSchema";
import "@/models/UserSchema";

export async function GET() {
  try {
    await connectDB();
    const transactions = await mongoose
      .model("Transaction")
      .find({})
      .populate("productId")
      .populate("performedBy");
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve transactions",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  try {
    z.object({
      productId: z.string().length(24, "Invalid product ID"),
      quantity: z.number().positive(),
      transactionType: z.enum(["IN", "OUT"]),
      performedBy: z.string().length(24, "Invalid user ID"),
      notes: z.string().optional(),
    }).parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid transaction data", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Validation error:", error);
    return NextResponse.json(
      {
        error: "Failed to validate transaction data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  try {
    await connectDB();
    const Product = mongoose.model("Product");
    const product = await Product.findById(body.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 },
      );
    }
    const currentQty = product.quantity ?? 0;
    const delta =
      body.transactionType === "IN"
        ? body.quantity
        : -body.quantity;
    const newQty = currentQty + delta;
    if (newQty < 0) {
      return NextResponse.json(
        {
          error: "Insufficient stock",
          details: `Product has ${currentQty} units; cannot perform OUT of ${body.quantity}`,
        },
        { status: 400 },
      );
    }
    const newTransaction = await mongoose
      .model("Transaction")
      .create(body);
    await Product.findByIdAndUpdate(body.productId, {
      quantity: newQty,
      updatedAt: new Date(),
    });
    await newTransaction.populate("productId");
    await newTransaction.populate("performedBy", "name email");
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      {
        error: "Failed to create transaction",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
