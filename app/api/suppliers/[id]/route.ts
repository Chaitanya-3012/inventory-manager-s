import { NextResponse } from "next/server";
import { z } from "zod";
import { supplierSchema, supplierUpdateSchema } from "@/lib/validation-schemas";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Supplier } from "@/models";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectDB();
    const supplierData = await Supplier.findById(id);
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
    supplierUpdateSchema.parse(body);
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
    await connectDB();
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, body, { new: true });
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
  const { id } = await params;

  try {
    z.object({ id: z.string().length(24, "Invalid supplier ID") }).parse({ id });
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
    await connectDB();
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
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
