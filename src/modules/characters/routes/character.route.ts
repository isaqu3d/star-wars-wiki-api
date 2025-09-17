import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createCharacterHandler } from "../handlers/create-character.handler";
import { getCharacterByIdHandler } from "../handlers/get-character-by-id.handler";
import { getCharactersHandler } from "../handlers/get-characters.handler";

export const characterRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(createCharacterHandler);
  server.register(getCharactersHandler);
  server.register(getCharacterByIdHandler);
};
