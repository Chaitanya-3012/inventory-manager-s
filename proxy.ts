import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSessionToken } from "@/lib/auth-utils";

// Define which paths require authentication
const protectedPaths = [
  "/dashboard",
  "/api/products",
  "/api/suppliers",
  "/api/transactions",
  "/api/users",
];

// Paths that should be excluded from protection (login, signup, etc.)
const publicPaths = [
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/session",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path should be publicly accessible
  const isPublicPath = publicPaths.some(path =>
    pathname.startsWith(path) || pathname === path
  );

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  // If it's not a protected path, allow access
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // For protected paths, check authentication
  const sessionToken = request.cookies.get("auth_token")?.value;

  if (!sessionToken) {
    // Redirect to login page
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = await validateSessionToken(sessionToken);

    if (!session) {
      // Session is invalid, redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Session is valid, allow access
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};