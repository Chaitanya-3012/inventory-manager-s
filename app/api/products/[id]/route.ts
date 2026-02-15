import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // TODO: Replace with MongoDB query
  try {
    const productData = await mongoose.model("Product").findById(id);
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
  const body = await req.json();
  // TODO: Validate with Zod and update in MongoDB
  try {
    z.object({
      name: z.string().min(2).max(100),
      description: z.string().optional(),
      category: z.string().min(5).max(100),
      costPrice: z.number().positive(),
      price: z.number().positive(),
      quantity: z.number().nonnegative(),
    }).parse(body);
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
    const updatedProduct = await mongoose
      .model("Product")
      .findByIdAndUpdate(id, body, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
  // TODO: Delete from MongoDB

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
