import { NextResponse } from "next/server";
import dummyData from "@/lib/dummy-data.json";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supplier = dummyData.suppliers.find((s) => s._id === id);
  if (!supplier) {
    return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
  }
  return NextResponse.json(supplier);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  return NextResponse.json({
    message: `Supplier ${id} updated (placeholder)`,
    data: body,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return NextResponse.json({
    message: `Supplier ${id} deleted (placeholder)`,
  });
}
