import { NextResponse } from "next/server";
import dummyData from "@/lib/dummy-data.json";

export async function GET() {
  return NextResponse.json(dummyData.transactions);
}

export async function POST(req: Request) {
  const body = await req.json();
  // TODO: Validate with Zod and save to MongoDB
  return NextResponse.json(
    { message: "Transaction created (placeholder)", data: body },
    { status: 201 },
  );
}
