import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "staff"],
    default: "staff",
  },
  department: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

async function createTestUser() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.log("MONGODB_URI not found in environment variables");
      return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✓ MongoDB connected successfully");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("Test user already exists");
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create new user
    const newUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      department: "Administration",
      role: "admin",
      isActive: true,
    });

    await newUser.save();
    console.log("Test user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: password123");

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

createTestUser();