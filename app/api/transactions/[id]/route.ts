import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { transactionSchema, transactionUpdateSchema } from "@/lib/validation-schemas";
import { connectDB } from "@/lib/mongodb";
import "@/models/TransactionSchema";
import "@/models/ProductSchema";
import "@/models/UserSchema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectDB();
    const transactionData = await mongoose
      .model("Transaction")
      .findById(id)
      .populate("productId")
      .populate("performedBy");
    if (!transactionData) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(transactionData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve transaction" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
    transactionUpdateSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid transaction data", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to validate transaction data" },
      { status: 500 },
    );
  }

  try {
    await connectDB();
    const Transaction = mongoose.model("Transaction");
    const Product = mongoose.model("Product");

    const oldTransaction = await Transaction.findById(id);
    if (!oldTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const updatePayload = { ...body, updatedAt: new Date() };
    const hasQtyOrTypeChange =
      body.quantity !== undefined ||
      body.transactionType !== undefined;

    if (hasQtyOrTypeChange) {
      const productId = oldTransaction.productId;
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      const oldQty = oldTransaction.quantity;
      const oldType = oldTransaction.transactionType;
      const newQty = body.quantity ?? oldQty;
      const newType = body.transactionType ?? oldType;

      const reverseOld =
        oldType === "IN" ? -oldQty : oldQty;
      const applyNew = newType === "IN" ? newQty : -newQty;
      const delta = reverseOld + applyNew;
      const newProductQty = (product.quantity ?? 0) + delta;

      if (newProductQty < 0) {
        return NextResponse.json(
          {
            error: "Insufficient stock",
            details: `Cannot update: resulting quantity would be ${newProductQty}`,
          },
          { status: 400 },
        );
      }

      await Product.findByIdAndUpdate(productId, {
        quantity: newProductQty,
        updatedAt: new Date(),
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true },
    )
      .populate("productId")
      .populate("performedBy", "name email");
    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    z.object({ id: z.string().length(24, "Invalid transaction ID") }).parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid transaction ID", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to validate transaction ID" },
      { status: 500 },
    );
  }

  try {
    await connectDB();
    const Transaction = mongoose.model("Transaction");
    const Product = mongoose.model("Product");

    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const reverseDelta =
      deletedTransaction.transactionType === "IN"
        ? -deletedTransaction.quantity
        : deletedTransaction.quantity;
    await Product.findByIdAndUpdate(deletedTransaction.productId, {
      $inc: { quantity: reverseDelta },
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
