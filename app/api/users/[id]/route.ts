import { NextResponse } from "next/server";
import dummyData from "@/lib/dummy-data.json";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = dummyData.users.find((u) => u._id === id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  return NextResponse.json({
    message: `User ${id} updated (placeholder)`,
    data: body,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return NextResponse.json({
    message: `User ${id} deleted (placeholder)`,
  });
}
