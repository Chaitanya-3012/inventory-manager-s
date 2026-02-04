import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  return NextResponse.json({
    message: `this is /transactions/${params.id} route`,
  });
}

export async function PUT(
  _req: Request,
  { params }: { params: { id: string } },
) {
  return NextResponse.json({
    message: `PUT to /transactions/${params.id} (placeholder)`,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  return NextResponse.json({
    message: `DELETE to /transactions/${params.id} (placeholder)`,
  });
}
