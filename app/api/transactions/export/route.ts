import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Transaction, Product, User } from "@/models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = async (_request: Request) => {
  try {
    await connectDB();

    // Fetch all transactions with populated references
    const transactions = await Transaction
      .find({})
      .populate("productId", "name")
      .populate("performedBy", "name email")
      .lean();

    // Transform data for CSV export
    const csvData = transactions.map(transaction => ({
      id: (transaction as any)._id.toString(),
      product: (transaction as any).productId?.name || "",
      productId: (transaction as any).productId?._id.toString() || "",
      quantity: (transaction as any).quantity,
      transactionType: (transaction as any).transactionType,
      performedBy: (transaction as any).performedBy?.name || "",
      performedByEmail: (transaction as any).performedBy?.email || "",
      notes: (transaction as any).notes || "",
      date: (transaction as any).date ? new Date((transaction as any).date).toISOString() : "",
      createdAt: (transaction as any).createdAt ? new Date((transaction as any).createdAt).toISOString() : "",
      updatedAt: (transaction as any).updatedAt ? new Date((transaction as any).updatedAt).toISOString() : ""
    }));

    // Generate CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    // Create response with CSV content
    const response = new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

    return response;
  } catch (error) {
    console.error("Error exporting transactions:", error);
    return NextResponse.json(
      {
        error: "Failed to export transactions",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};