import { NextResponse } from "next/server";
import { z } from "zod";
import { supplierSchema } from "@/lib/validation-schemas";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Supplier } from "@/models";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const suppliers = await Supplier.find({});
  return NextResponse.json(suppliers);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await sanitizeRequestBody(req);

  supplierSchema.parse(body);

  await connectDB();
  const newSupplier = await Supplier.create(body);
  return NextResponse.json(newSupplier, { status: 201 });
});
