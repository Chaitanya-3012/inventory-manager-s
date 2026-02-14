import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Replace with MongoDB query
  return NextResponse.json([]);
}

export async function POST(req: Request) {
  const body = await req.json();
  // TODO: Validate with Zod and save to MongoDB
  return NextResponse.json(
    { message: "Supplier creation not yet implemented", data: body },
    { status: 501 },
  );
}
