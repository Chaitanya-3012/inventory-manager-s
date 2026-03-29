import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Custom error classes for different types of errors
export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class InternalServerError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = "InternalServerError";
  }
}

// Error handler function
export function handleApiError(error: unknown): Response {
  console.error("API Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.issues,
        type: "ValidationError",
      },
      { status: 400 }
    );
  }

  // Handle our custom validation errors
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
        type: "ValidationError",
      },
      { status: 400 }
    );
  }

  // Handle not found errors
  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        error: error.message,
        type: "NotFoundError",
      },
      { status: 404 }
    );
  }

  // Handle unauthorized errors
  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        error: error.message,
        type: "UnauthorizedError",
      },
      { status: 401 }
    );
  }

  // Handle forbidden errors
  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      {
        error: error.message,
        type: "ForbiddenError",
      },
      { status: 403 }
    );
  }

  // Handle database errors
  if (error instanceof DatabaseError) {
    return NextResponse.json(
      {
        error: "Database error occurred",
        details: error.originalError?.message,
        type: "DatabaseError",
      },
      { status: 500 }
    );
  }

  // Handle internal server errors
  if (error instanceof InternalServerError) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.originalError?.message,
        type: "InternalServerError",
      },
      { status: 500 }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error.message,
        type: "GenericError",
      },
      { status: 500 }
    );
  }

  // Handle non-error objects
  return NextResponse.json(
    {
      error: "An unexpected error occurred",
      details: String(error),
      type: "UnknownError",
    },
    { status: 500 }
  );
}

// Helper function to wrap API route handlers with error handling
export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(
  handler: T
): (...args: Parameters<T>) => Promise<Response> {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}