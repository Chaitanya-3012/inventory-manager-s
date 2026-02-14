import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // TODO: Replace with MongoDB query
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  // TODO: Validate and update in MongoDB
  return NextResponse.json(
    { message: "Update not yet implemented", id, data: body },
    { status: 501 },
  );
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // TODO: Delete from MongoDB
  return NextResponse.json(
    { message: "Delete not yet implemented", id },
    { status: 501 },
  );
}
