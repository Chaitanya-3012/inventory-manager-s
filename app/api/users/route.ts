import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import "@/models/UserSchema";

export async function GET() {
  try {
    await connectDB();
    const users = await mongoose.model("User").find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve users",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  try {
    z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      role: z.enum(["admin", "manager", "staff"]),
      department: z.string().min(2).max(100),
      password: z.string().min(6),
    }).parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid user data", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Validation error:", error);
    return NextResponse.json(
      {
        error: "Failed to validate user data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const userDataWithHashedPassword = {
      ...body,
      password: hashedPassword,
    };
    await connectDB();
    const newUser = await mongoose
      .model("User")
      .create(userDataWithHashedPassword);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
