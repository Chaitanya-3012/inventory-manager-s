import { NextResponse } from "next/server";
import { validateSessionToken } from "@/lib/auth-utils";

export async function GET(request: Request) {
  try {
    // Get the session token from cookies
    const cookieHeader = request.headers.get("cookie");
    const tokenMatch = cookieHeader?.match(/auth_token=([^;]*)/);
    const sessionToken = tokenMatch ? tokenMatch[1] : null;

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Validate session
    const session = await validateSessionToken(sessionToken);

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: session.userId,
          email: session.userEmail,
          role: session.userRole,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}