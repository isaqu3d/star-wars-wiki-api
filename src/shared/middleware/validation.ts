import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

// Sanitization utilities
export const sanitizers = {
  // Remove HTML tags and dangerous characters
  sanitizeString: (str: string): string => {
    if (typeof str !== "string") return "";
    return str
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/[<>'"&]/g, "") // Remove dangerous characters
      .trim()
      .slice(0, 1000); // Limit length
  },

  // Sanitize search queries
  sanitizeSearchQuery: (query: string): string => {
    if (typeof query !== "string") return "";
    return query
      .replace(/[^\w\s-]/g, "") // Only allow word characters, spaces, and hyphens
      .trim()
      .slice(0, 100); // Limit search query length
  },
};

// Global validation schemas with sanitization
export const commonSchemas = {
  // Pagination with strict limits
  pagination: z.object({
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a positive integer")
      .default("1")
      .transform(Number)
      .refine((val: number) => val >= 1 && val <= 1000, "Page must be between 1 and 1000"),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a positive integer")
      .default("10")
      .transform(Number)
      .refine((val: number) => val >= 1 && val <= 100, "Limit must be between 1 and 100"),
  }),

  // Search with sanitization
  search: z.object({
    search: z
      .string()
      .optional()
      .transform((val) => val ? sanitizers.sanitizeSearchQuery(val) : undefined),
  }),

  // ID parameter validation
  idParam: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "ID must be a positive integer")
      .transform(Number)
      .refine((val: number) => val >= 1 && val <= 2147483647, "Invalid ID range"),
  }),
};

// Middleware for request sanitization
export const registerValidationMiddleware = (server: FastifyInstance) => {
  server.addHook("preValidation", async (request: FastifyRequest) => {
    // Sanitize string fields in request body
    if (request.body && typeof request.body === "object") {
      const body = request.body as Record<string, any>;
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
          body[key] = sanitizers.sanitizeString(value);
        }
      }
    }

    // Log suspicious requests
    const userAgent = request.headers["user-agent"] || "";
    const suspiciousPatterns = [
      /sqlmap/i,
      /union.*select/i,
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
      request.log.warn({
        ip: request.ip,
        userAgent,
        url: request.url,
      }, "Suspicious request detected");
    }
  });
};