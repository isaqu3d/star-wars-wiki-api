import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import path from "node:path";

import { config } from "./config/environment";
import { configureLogger } from "./config/logger";
import { registerSecurity } from "./config/security";
import { registerSwagger } from "./config/swagger";
import { characterRoutes } from "./modules/characters/routes/characters.routes";
import { filmRoutes } from "./modules/films/film.routes";
import { planetRoutes } from "./modules/planets/routes/planet.routes";
import { starshipRoutes } from "./modules/starships/starship.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { registerValidationMiddleware } from "./shared/middleware/validation";

const server = fastify({
  logger: config.isDevelopment
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
      }
    : true,
  trustProxy: true,
  bodyLimit: 1024 * 1024,
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

// Register security middleware first
server.register(registerSecurity);

// Register validation middleware
registerValidationMiddleware(server);

// Configure logging
configureLogger(server);

// Register Swagger
server.register(registerSwagger);

// Register static files with security considerations
server.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/public/",
  maxAge: "1d",
  immutable: true,
  acceptRanges: false,
});

// Register API routes with prefixes
server.register(characterRoutes, { prefix: "/characters" });
server.register(filmRoutes, { prefix: "/films" });
server.register(planetRoutes, { prefix: "/planets" });
server.register(starshipRoutes, { prefix: "/starships" });
server.register(vehicleRoutes, { prefix: "/vehicles" });

export { server };
