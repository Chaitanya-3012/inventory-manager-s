import sanitizeHtml from "sanitize-html";

// Sanitize input to prevent XSS and other injection attacks
export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {}, // Remove all attributes
  });
}

// Sanitize object properties recursively
export function sanitizeObject(obj: any): any {
  if (typeof obj === "string") {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === "object") {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

// Sanitize request body
export async function sanitizeRequestBody(req: Request): Promise<any> {
  try {
    const body = await req.json();
    return sanitizeObject(body);
  } catch (error) {
    throw new Error("Invalid JSON in request body");
  }
}