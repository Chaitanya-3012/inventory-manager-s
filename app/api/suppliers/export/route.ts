import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Supplier } from "@/models";

export const GET = async (_request: Request) => {
  try {
    await connectDB();

    // Fetch all suppliers
    const suppliers = await Supplier.find({});

    // Transform data for CSV export
    const csvData = suppliers.map(supplier => {
      // Type assertions for lean document properties
      const leanSupplier = supplier as any;

      return {
        id: leanSupplier._id.toString(),
        name: leanSupplier.name,
        email: leanSupplier.email,
        phone: leanSupplier.phone,
        address: leanSupplier.address,
        city: leanSupplier.city,
        state: leanSupplier.state,
        country: leanSupplier.country,
        paymentTerms: leanSupplier.paymentTerms || "",
        isActive: leanSupplier.isActive ? "Yes" : "No",
        createdAt: leanSupplier.createdAt ? new Date(leanSupplier.createdAt).toISOString() : "",
        updatedAt: leanSupplier.updatedAt ? new Date(leanSupplier.updatedAt).toISOString() : ""
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
        "Content-Disposition": `attachment; filename="suppliers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

    return response;
  } catch (error) {
    console.error("Error exporting suppliers:", error);
    return NextResponse.json(
      {
        error: "Failed to export suppliers",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};