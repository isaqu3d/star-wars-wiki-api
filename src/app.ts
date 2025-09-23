import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import path from "node:path";

import { registerSwagger } from "./config/swagger";
import { characterRoutes } from "./modules/characters/character.routes";
import { filmRoutes } from "./modules/films/film.routes";
import { planetRoutes } from "./modules/planets/planet.routes";
import { starshipRoutes } from "./modules/starships/starship.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

// Register Swagger
server.register(registerSwagger);

// Register static files
server.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/public/",
});

// Register routes
server.register(characterRoutes);
server.register(planetRoutes);
server.register(filmRoutes);
server.register(starshipRoutes);
server.register(vehicleRoutes);

export { server };