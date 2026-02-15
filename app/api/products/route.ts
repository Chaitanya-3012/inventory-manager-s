import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import "@/models/ProductSchema";
import "@/models/SupplierSchema";
import "@/models/UserSchema";
import { connectDB } from "@/lib/mongodb";

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
  await connectDB();
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
