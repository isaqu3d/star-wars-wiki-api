import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  getFilmsHandler,
  getFilmByIdHandler,
} from "./film.handler";

export const filmRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(getFilmsHandler);
  server.register(getFilmByIdHandler);
};