import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { Supplier } from "@/models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = async (_request: Request) => {
  try {
    await connectDB();

    // Fetch all suppliers
    const suppliers = await Supplier.find({});

    // Transform data for CSV export
    const csvData = suppliers.map(supplier => ({
      id: (supplier as any)._id.toString(),
      name: (supplier as any).name,
      email: (supplier as any).email,
      phone: (supplier as any).phone,
      address: (supplier as any).address,
      city: (supplier as any).city,
      state: (supplier as any).state,
      country: (supplier as any).country,
      paymentTerms: (supplier as any).paymentTerms || "",
      isActive: (supplier as any).isActive ? "Yes" : "No",
      createdAt: (supplier as any).createdAt ? new Date((supplier as any).createdAt).toISOString() : "",
      updatedAt: (supplier as any).updatedAt ? new Date((supplier as any).updatedAt).toISOString() : ""
    }));

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