import { NextResponse } from "next/server";
import dummyData from "@/lib/dummy-data.json";
import { populateProductReferences } from "@/lib/populate-references";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = dummyData.products.find((p) => p._id === id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const productWithRefs = populateProductReferences(product);
  return NextResponse.json(productWithRefs);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  return NextResponse.json({
    message: `Product ${id} updated (placeholder)`,
    data: body,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return NextResponse.json({
    message: `Product ${id} deleted (placeholder)`,
  });
}
