import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "this is /transactions route" });
}

export async function POST() {
  return NextResponse.json({ message: "POST to /transactions (placeholder)" });
}
