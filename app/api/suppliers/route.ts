import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import "@/models/SupplierSchema";

export async function GET() {
  try {
    await connectDB();
    const suppliers = await mongoose.model("Supplier").find({});
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve suppliers",
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
      email: z.string().email(),
      phone: z.string().min(10),
      address: z.string().min(5).max(200),
      city: z.string().min(2).max(100),
      state: z.string().min(2).max(100),
      country: z.string().min(2).max(100),
      paymentTerms: z.string().optional(),
    }).parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid supplier data", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Validation error:", error);
    return NextResponse.json(
      {
        error: "Failed to validate supplier data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  try {
    await connectDB();
    const newSupplier = await mongoose.model("Supplier").create(body);
    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      {
        error: "Failed to create supplier",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
