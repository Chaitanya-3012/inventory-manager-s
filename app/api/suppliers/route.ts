import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supplierSchema } from "@/lib/validation-schemas";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import { connectDB } from "@/lib/mongodb";
import "@/models/SupplierSchema";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const suppliers = await mongoose.model("Supplier").find({});
  return NextResponse.json(suppliers);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await sanitizeRequestBody(req);

  supplierSchema.parse(body);

  await connectDB();
  const newSupplier = await mongoose.model("Supplier").create(body);
  return NextResponse.json(newSupplier, { status: 201 });
});
