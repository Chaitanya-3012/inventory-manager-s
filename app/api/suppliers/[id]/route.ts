import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import "@/models/SupplierSchema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  try {
    const supplierData = await mongoose.model("Supplier").findById(id);
    if (!supplierData) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(supplierData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve supplier" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
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
    z.object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(10).optional(),
      address: z.string().min(5).max(200).optional(),
      city: z.string().min(2).max(100).optional(),
      state: z.string().min(2).max(100).optional(),
      country: z.string().min(2).max(100).optional(),
      paymentTerms: z.string().optional(),
    }).parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid supplier data", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to validate supplier data" },
      { status: 500 },
    );
  }

  try {
    const updatedSupplier = await mongoose
      .model("Supplier")
      .findByIdAndUpdate(id, body, { new: true });
    if (!updatedSupplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedSupplier);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;

  try {
    z.object({
      id: z.string().length(24, "Invalid supplier ID"),
    }).parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid supplier ID", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to validate supplier ID" },
      { status: 500 },
    );
  }

  try {
    const deletedSupplier = await mongoose
      .model("Supplier")
      .findByIdAndDelete(id);
    if (!deletedSupplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 },
    );
  }
}
