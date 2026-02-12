import { NextResponse } from "next/server";
import dummyData from "@/lib/dummy-data.json";
import { populateProductsReferences } from "@/lib/populate-references";

export async function GET() {
  const productsWithRefs = populateProductsReferences(dummyData.products);
  return NextResponse.json(productsWithRefs);
}

export async function POST(req: Request) {
  const body = await req.json();
  // TODO: Validate with Zod and save to MongoDB
  return NextResponse.json(
    { message: "Product created (placeholder)", data: body },
    { status: 201 },
  );
}
