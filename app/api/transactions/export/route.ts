import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Transaction, Product, User } from "@/models";

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
    const csvData = transactions.map(transaction => {
      // Type assertions for lean document properties
      const leanTransaction = transaction as any;

      return {
        id: leanTransaction._id.toString(),
        product: leanTransaction.productId?.name || "",
        productId: leanTransaction.productId?._id.toString() || "",
        quantity: leanTransaction.quantity,
        transactionType: leanTransaction.transactionType,
        performedBy: leanTransaction.performedBy?.name || "",
        performedByEmail: leanTransaction.performedBy?.email || "",
        notes: leanTransaction.notes || "",
        date: leanTransaction.date ? new Date(leanTransaction.date).toISOString() : "",
        createdAt: leanTransaction.createdAt ? new Date(leanTransaction.createdAt).toISOString() : "",
        updatedAt: leanTransaction.updatedAt ? new Date(leanTransaction.updatedAt).toISOString() : ""
      };
    });

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