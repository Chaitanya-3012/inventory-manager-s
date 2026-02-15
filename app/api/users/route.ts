import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const users = await mongoose.model("User").find({});
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve users" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();

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
    return NextResponse.json(
      { error: "Failed to validate user data" },
      { status: 500 },
    );
  }

  try {
    const newUser = await mongoose.model("User").create(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
