import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  getStarshipsHandler,
  getStarshipByIdHandler,
} from "./starship.handler";

export const starshipRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(getStarshipsHandler);
  server.register(getStarshipByIdHandler);
};