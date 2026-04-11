import sanitizeHtml from "sanitize-html";

// Sanitize input to prevent XSS and other injection attacks
export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {}, // Remove all attributes
  });
}

// Sanitize object properties recursively
export function sanitizeObject(obj: unknown): unknown {
  if (typeof obj === "string") {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

// Sanitize request body
export async function sanitizeRequestBody(req: Request): Promise<unknown> {
  try {
    const body = await req.json();
    return sanitizeObject(body);
  } catch (error: unknown) {
    throw new Error("Invalid JSON in request body");
  }
}