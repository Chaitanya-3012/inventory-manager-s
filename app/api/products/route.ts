import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "this is /products route" });
}

export async function POST() {
  return NextResponse.json({ message: "POST to /products (placeholder)" });
}
