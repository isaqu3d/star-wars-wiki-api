import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  getPlanetsHandler,
  getPlanetByIdHandler,
} from "./planet.handler";

export const planetRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(getPlanetsHandler);
  server.register(getPlanetByIdHandler);
};