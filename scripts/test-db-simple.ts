import mongoose from "mongoose";

async function testConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.log("MONGODB_URI not found in environment variables");
      console.log("Available env vars:", Object.keys(process.env));
      return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✓ MongoDB connected successfully");

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("✗ MongoDB connection error:", error);
  }
}

testConnection();