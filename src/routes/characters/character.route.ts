import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createCharacterHandler } from "./handlers/create-character";
import { getCharacterByIdHandler } from "./handlers/get-character-by-id";
import { getCharactersHandler } from "./handlers/get-characters";

export const characterRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(createCharacterHandler);
  server.register(getCharactersHandler);
  server.register(getCharacterByIdHandler);
};
