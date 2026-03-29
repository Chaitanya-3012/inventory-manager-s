import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { productSchema, productUpdateSchema } from "@/lib/validation-schemas";
import { connectDB } from "@/lib/mongodb";
import "@/models/ProductSchema";
import "@/models/SupplierSchema";
import "@/models/UserSchema";
import "@/models/TransactionSchema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectDB();
    const productData = await mongoose
      .model("Product")
      .findById(id)
      .populate("supplierId", "name email")
      .populate("createdBy", "name email");
    if (!productData) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(productData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve product" },
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
    productUpdateSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product data", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to validate product data" },
      { status: 500 },
    );
  }
  try {
    await connectDB();

    // Get the current product to compare quantities
    const currentProduct = await mongoose.model("Product").findById(id);
    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await mongoose
      .model("Product")
      .findByIdAndUpdate(id, body, { new: true })
      .populate("supplierId", "name email")
      .populate("createdBy", "name email");

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Automatically create a transaction if quantity changed
    if (body.quantity !== undefined && body.quantity !== currentProduct.quantity) {
      const Transaction = mongoose.model("Transaction");
      const quantityDiff = body.quantity - currentProduct.quantity;

      if (quantityDiff !== 0) {
        const transactionType = quantityDiff > 0 ? "IN" : "OUT";
        const absQuantity = Math.abs(quantityDiff);

        // We need a performedBy user for the transaction, try to use the one from the update or fall back to the product creator
        const performedBy = body.createdBy || currentProduct.createdBy;

        await Transaction.create({
          productId: updatedProduct._id,
          quantity: absQuantity,
          transactionType: transactionType,
          performedBy: performedBy,
          notes: `Quantity adjustment: ${currentProduct.quantity} → ${body.quantity}`,
          isAutomated: true,
        });
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
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
    z.object({
      id: z.string().length(24, "Invalid product ID"),
    }).parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product ID", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to validate product ID" },
      { status: 500 },
    );
  }
  try {
    await connectDB();
    const deletedProduct = await mongoose
      .model("Product")
      .findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
