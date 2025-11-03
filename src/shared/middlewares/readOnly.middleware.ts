import { FastifyRequest, FastifyReply } from "fastify";
import { config } from "../../config/environment";

/**
 * Read-Only Middleware
 *
 * Blocks write operations (POST, PUT, DELETE, PATCH) in production environment.
 * This keeps the public API read-only while allowing full CRUD in development/test.
 *
 * Usage:
 * - In production: Only GET requests are allowed
 * - In development/test: All HTTP methods work normally (for seeding, testing, etc.)
 */
export async function readOnlyMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Only enforce read-only in production
  if (!config.isProduction) {
    return; // Allow all methods in dev/test
  }

  // Check if the request is a write operation
  const writeOperations = ["POST", "PUT", "DELETE", "PATCH"];

  if (writeOperations.includes(request.method)) {
    return reply.status(405).send({
      error: "This API is read-only in production",
      code: "METHOD_NOT_ALLOWED",
      statusCode: 405,
      message: "Write operations (POST, PUT, DELETE, PATCH) are not allowed in production. This is a public read-only API.",
      timestamp: new Date().toISOString(),
      path: request.url,
      hint: "Only GET requests are permitted. For development or testing purposes, use a local environment.",
    });
  }

  // Allow read operations (GET, HEAD, OPTIONS)
  return;
}

/**
 * Helper to determine if current environment allows write operations
 */
export function isWriteAllowed(): boolean {
  return !config.isProduction;
}

/**
 * Decorator-style function to apply read-only protection to specific routes
 */
export function protectWrite() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    return readOnlyMiddleware(request, reply);
  };
}
