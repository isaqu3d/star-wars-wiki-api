import { FastifyInstance } from "fastify";
import { config } from "./environment";

export const configureLogger = (server: FastifyInstance) => {
  // Request logging middleware
  server.addHook("onRequest", async (request, reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      userAgent: request.headers["user-agent"],
      ip: request.ip,
    }, "Incoming request");
  });

  // Response logging middleware
  server.addHook("onResponse", async (request, reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    }, "Request completed");
  });

  // Error logging middleware
  server.addHook("onError", async (request, reply, error) => {
    request.log.error({
      method: request.method,
      url: request.url,
      error: {
        message: error.message,
        stack: config.isDevelopment ? error.stack : undefined,
      },
    }, "Request error");
  });

  // Health check endpoint
  server.get("/health", async (request, reply) => {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    };
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    server.log.info("Starting graceful shutdown...");

    server.close().then(() => {
      server.log.info("Server closed successfully");
      process.exit(0);
    }).catch((err: any) => {
      server.log.error(err, "Error during graceful shutdown");
      process.exit(1);
    });
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
};