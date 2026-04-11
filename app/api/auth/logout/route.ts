import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    // Get the session token from cookies
    const cookieHeader = request.headers.get("cookie");
    const tokenMatch = cookieHeader?.match(/auth_token=([^;]*)/);
    const sessionToken = tokenMatch ? tokenMatch[1] : null;

    // Delete session if it exists
    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    // Create response to clear cookie
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}