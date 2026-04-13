import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Transaction, Product } from "@/models";

export async function POST(
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

    // Find the original transaction
    const originalTransaction = await Transaction.findById(id);
    if (!originalTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    // Check if transaction is already undone
    if (originalTransaction.isReversal) {
      return NextResponse.json(
        { error: "Cannot undo a reversal transaction" },
        { status: 400 },
      );
    }

    // Create a reverse transaction
    const reverseTransactionData = {
      productId: originalTransaction.productId,
      quantity: originalTransaction.quantity,
      // Reverse the transaction type
      transactionType: originalTransaction.transactionType === "IN" ? "OUT" : "IN",
      performedBy: originalTransaction.performedBy,
      notes: `Reversal of transaction ${originalTransaction._id}: ${originalTransaction.notes || 'Original transaction'}`,
      isReversal: true,
      originalTransaction: originalTransaction._id,
      date: new Date(),
    };

    // Create the reverse transaction
    const reverseTransaction = await Transaction.create(reverseTransactionData);

    // Update the original transaction to mark it as reversed
    await Transaction.findByIdAndUpdate(id, {
      reversedBy: reverseTransaction._id,
      updatedAt: new Date(),
    });

    // Apply the reverse quantity change to the product
    const reverseDelta =
      reverseTransaction.transactionType === "IN"
        ? reverseTransaction.quantity
        : -reverseTransaction.quantity;

    await Product.findByIdAndUpdate(reverseTransaction.productId, {
      $inc: { quantity: reverseDelta },
      updatedAt: new Date(),
    });

    // Populate the reverse transaction for response
    await reverseTransaction.populate("productId");
    await reverseTransaction.populate("performedBy", "name email");

    return NextResponse.json({
      message: "Transaction undone successfully",
      reverseTransaction,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to undo transaction", details: (error as Error).message },
      { status: 500 },
    );
  }
}