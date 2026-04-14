/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Product } from "@/models";

export const GET = async (_request: Request) => {
  try {
    await connectDB();

    // Fetch all products with populated references
    const products = await Product
      .find({})
      .populate("supplierId", "name email")
      .populate("createdBy", "name email")
      .lean();

    // Transform data for CSV export
    const csvData = products.map(product => ({
      id: (product as any)._id.toString(),
      name: (product as any).name,
      description: (product as any).description || "",
      category: (product as any).category,
      price: (product as any).price,
      costPrice: (product as any).costPrice,
      quantity: (product as any).quantity,
      supplier: (product as any).supplierId?.name || "",
      supplierEmail: (product as any).supplierId?.email || "",
      createdBy: (product as any).createdBy?.name || "",
      createdByEmail: (product as any).createdBy?.email || "",
      createdAt: (product as any).createdAt ? new Date((product as any).createdAt).toISOString() : "",
      updatedAt: (product as any).updatedAt ? new Date((product as any).updatedAt).toISOString() : ""
    }));

    // Generate CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    // Create response with CSV content
    const response = new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

    return response;
  } catch (error) {
    console.error("Error exporting products:", error);
    return NextResponse.json(
      {
        error: "Failed to export products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};