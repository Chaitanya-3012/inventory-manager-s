import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/mongodb";

// Import Session model directly
import { Session } from "@/models/Session";

// JWT secret - in production, use a strong secret from environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "your-secret-key-change-this-in-production"
);

export async function createToken(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  await connectDB();

  // Generate a random token
  const token = nanoid(32);

  // Calculate expiration (7 days from now)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Save session to database
  const session = new Session({
    userId,
    token,
    expiresAt,
  });

  await session.save();

  return token;
}

export async function validateSessionToken(token: string) {
  await connectDB();

  const session = await Session.findOne({ token }).populate("userId");

  if (!session) {
    return null;
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    await Session.findByIdAndDelete(session._id);
    return null;
  }

  return {
    userId: session.userId._id.toString(),
    userName: session.userId.name,
    userEmail: session.userId.email,
    userRole: session.userId.role,
  };
}

export async function deleteSession(token: string) {
  await connectDB();
  await Session.deleteOne({ token });
}

// export async function getCurrentUser() {
//   const cookieStore = cookies();
//   const token = cookieStore.get("auth_token")?.value;

//   if (!token) {
//     return null;
//   }

//   const session = await validateSessionToken(token);
//   return session;
// }