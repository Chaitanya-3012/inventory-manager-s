import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  // TODO: Replace with MongoDB query
  try {
    const products = await mongoose.model("Product").find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve products" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  
  try {
    z.object({
      name: z.string().min(2).max(100),
      description: z.string().optional(),
      category: z.string().min(5).max(100),
      price: z.number().positive(),
      costPrice: z.number().positive(),
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
    const newProduct = await mongoose.model("Product").create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
