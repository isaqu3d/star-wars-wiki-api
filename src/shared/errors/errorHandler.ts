import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./AppError";
import { config } from "../../config/environment";

/**
 * Error response interface
 */
interface ErrorResponse {
  error: string;
  code?: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: any;
  stack?: string;
}

/**
 * Global error handler for Fastify
 */
export const errorHandler = (
  error: FastifyError | AppError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const timestamp = new Date().toISOString();
  const path = request.url;

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: "Validation error",
      code: "VALIDATION_ERROR",
      statusCode: 400,
      timestamp,
      path,
      details: error.issues.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    };

    request.log.warn({ error: errorResponse }, "Validation error");

    return reply.status(400).send(errorResponse);
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    const errorResponse: ErrorResponse = {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp,
      path,
    };

    // Log operational errors as warnings
    if (error.isOperational) {
      request.log.warn({ error: errorResponse }, "Operational error");
    } else {
      request.log.error({ error: errorResponse, stack: error.stack }, "Application error");
    }

    return reply.status(error.statusCode).send(errorResponse);
  }

  // Handle Fastify validation errors
  if ('validation' in error && error.validation) {
    const errorResponse: ErrorResponse = {
      error: "Validation error",
      code: "VALIDATION_ERROR",
      statusCode: 400,
      timestamp,
      path,
      details: error.validation,
    };

    request.log.warn({ error: errorResponse }, "Fastify validation error");

    return reply.status(400).send(errorResponse);
  }

  // Handle Fastify errors
  if ('statusCode' in error && error.statusCode) {
    const errorResponse: ErrorResponse = {
      error: error.message,
      code: 'code' in error ? error.code : undefined,
      statusCode: error.statusCode,
      timestamp,
      path,
    };

    request.log.error({ error: errorResponse }, "Fastify error");

    return reply.status(error.statusCode).send(errorResponse);
  }

  // Handle unknown errors
  const errorResponse: ErrorResponse = {
    error: config.isDevelopment ? error.message : "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
    timestamp,
    path,
    stack: config.isDevelopment ? error.stack : undefined,
  };

  request.log.error(
    {
      error: errorResponse,
      stack: error.stack,
      errorName: error.name,
    },
    "Unexpected error"
  );

  return reply.status(500).send(errorResponse);
};

/**
 * Not found handler (404)
 */
export const notFoundHandler = (request: FastifyRequest, reply: FastifyReply) => {
  const errorResponse: ErrorResponse = {
    error: `Route ${request.method} ${request.url} not found`,
    code: "NOT_FOUND",
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: request.url,
  };

  request.log.warn({ error: errorResponse }, "Route not found");

  return reply.status(404).send(errorResponse);
};
