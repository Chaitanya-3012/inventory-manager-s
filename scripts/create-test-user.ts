import bcrypt from "bcrypt";
import User from "../models/UserSchema";
import { connectDB } from "../lib/mongodb";

async function createTestUser() {
  try {
    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("Test user already exists");
      process.exit(0);
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
    process.exit(0);
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();