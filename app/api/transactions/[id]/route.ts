import { NextResponse } from "next/server";
import dummyData from "@/lib/dummy-data.json";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const transaction = dummyData.transactions.find((t) => t._id === id);
  if (!transaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 },
    );
  }
  return NextResponse.json(transaction);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  return NextResponse.json({
    message: `Transaction ${id} updated (placeholder)`,
    data: body,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return NextResponse.json({
    message: `Transaction ${id} deleted (placeholder)`,
  });
}
