import { FastifyInstance } from "fastify";
import { config } from "./environment";

export const registerSecurity = async (server: FastifyInstance) => {
  // Try to register CORS if available
  try {
    const fastifyCors = await import("@fastify/cors");
    await server.register(fastifyCors.default, {
      origin: config.isDevelopment
        ? ["http://localhost:3000", "http://localhost:3333", "http://127.0.0.1:3000"]
        : (origin: string | undefined, cb: (err: Error | null, allow: boolean) => void) => {
            // In production, implement proper origin validation
            const hostname = new URL(origin || "").hostname;
            const allowed = [
              "yourdomain.com",
              "www.yourdomain.com",
              // Add your production domains here
            ];

            if (!origin || allowed.includes(hostname)) {
              cb(null, true);
            } else {
              cb(new Error("Not allowed by CORS"), false);
            }
          },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
  } catch (error) {
    server.log.warn("@fastify/cors not available, skipping CORS configuration");
  }

  // Try to register Helmet if available
  try {
    const fastifyHelmet = await import("@fastify/helmet");
    await server.register(fastifyHelmet.default, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable for API
      hsts: config.isProduction ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      } : false,
    });
  } catch (error) {
    server.log.warn("@fastify/helmet not available, skipping security headers");
  }

  // Try to register Rate Limiting if available
  try {
    const fastifyRateLimit = await import("@fastify/rate-limit");
    await server.register(fastifyRateLimit.default, {
      max: config.isDevelopment ? 1000 : 100, // requests per window
      timeWindow: "1 minute",
      errorResponseBuilder: (request: any, context: any) => {
        return {
          code: 429,
          error: "Too Many Requests",
          message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds`,
          date: new Date().toISOString(),
        };
      },
    });
  } catch (error) {
    server.log.warn("@fastify/rate-limit not available, skipping rate limiting");
  }

  // Basic request size limit (always available)
  server.addContentTypeParser(
    "application/json",
    { parseAs: "string", bodyLimit: 1024 * 1024 }, // 1MB limit
    server.getDefaultJsonParser("ignore", "ignore")
  );
};