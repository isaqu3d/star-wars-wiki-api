import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  createCharacterHandler,
  getCharacterByIdHandler,
  getCharactersHandler,
} from "./character.handler";

export const characterRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(createCharacterHandler);
  server.register(getCharactersHandler);
  server.register(getCharacterByIdHandler);
};
