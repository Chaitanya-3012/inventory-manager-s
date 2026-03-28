"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated && user === null) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (user === undefined) {
    return <LoadingOverlay isVisible={true} text="Checking authentication..." />;
  }

  // If user is not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}