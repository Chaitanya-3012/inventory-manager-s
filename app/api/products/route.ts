import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import "@/models/ProductSchema";
import "@/models/SupplierSchema";
import "@/models/UserSchema";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  // returns a list of all products in the database
  try {
    await connectDB();
    const products = await mongoose.model("Product").find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve products",
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
    console.error("Validation error:", error);
    return NextResponse.json(
      {
        error: "Failed to validate product data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
  try {
    await connectDB();
    const newProduct = await mongoose.model("Product").create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
