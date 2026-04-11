import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { userSchema } from "@/lib/validation-schemas";
import bcrypt from "bcrypt";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import { connectDB } from "@/lib/mongodb";
import "@/models/UserSchema";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const users = await mongoose.model("User").find({});
  return NextResponse.json(users);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await sanitizeRequestBody(req);

  // Validate the request body
  userSchema.parse(body);

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
});
