import { connectDB } from "../lib/mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testConnection() {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Found" : "Not found");
    console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "Found" : "Not found");

    await connectDB();
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection error:", error);
  }
}

testConnection();