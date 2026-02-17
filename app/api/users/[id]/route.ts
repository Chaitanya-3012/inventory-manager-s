import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import "@/models/UserSchema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await connectDB();
    const userData = await mongoose.model("User").findById(id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve user" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
      role: z.enum(["admin", "manager", "staff"]).optional(),
      department: z.string().min(2).max(100).optional(),
      password: z.string().min(6).optional(),
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
    await connectDB();
    let updateData = body;
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateData = {
        ...body,
        password: hashedPassword,
      };
    }
    const updatedUser = await mongoose
      .model("User")
      .findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    z.object({
      id: z.string().length(24, "Invalid user ID"),
    }).parse({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid user ID", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to validate user ID" },
      { status: 500 },
    );
  }

  try {
    await connectDB();
    const deletedUser = await mongoose.model("User").findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
