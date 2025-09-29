import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  createCharacterHandler,
  deleteCharacterHandler,
  getCharacterByIdHandler,
  getCharactersHandler,
  updateCharacterHandler,
} from "./character.handler";

export const characterRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(createCharacterHandler);
  server.register(getCharactersHandler);
  server.register(getCharacterByIdHandler);
  server.register(deleteCharacterHandler);
  server.register(updateCharacterHandler);
};
