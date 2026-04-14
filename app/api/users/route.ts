import { NextResponse } from "next/server";
import { userSchema } from "@/lib/validation-schemas";
import bcrypt from "bcrypt";
import { withErrorHandling } from "@/lib/error-handler";
import { sanitizeRequestBody } from "@/lib/sanitizer";
import { connectDB } from "@/lib/mongodb";

// Import models to ensure they're registered with Mongoose
import "@/models";
import { User } from "@/models";

export const GET = withErrorHandling(async () => {
  await connectDB();
  const users = await User.find({});
  return NextResponse.json(users);
});

export const POST = withErrorHandling(async (req: Request) => {
  const sanitizedBody = await sanitizeRequestBody(req);
  const body = sanitizedBody as Record<string, unknown>;

  userSchema.parse(body);

  const password = body.password as string;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userDataWithHashedPassword = {
    ...body,
    password: hashedPassword,
  };
  await connectDB();
  const newUser = await User.create(userDataWithHashedPassword);
  return NextResponse.json(newUser, { status: 201 });
});
