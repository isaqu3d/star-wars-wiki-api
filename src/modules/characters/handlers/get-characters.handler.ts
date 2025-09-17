import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  characterQueryParamsSchema,
  charactersResponseSchema,
} from "../character.schemas";
import { getCharacters } from "../character.services";

export const getCharactersHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/characters",
    {
      schema: {
        tags: ["Characters"],
        summary: "Get all characters with pagination and search",
        querystring: characterQueryParamsSchema,
        response: {
          200: charactersResponseSchema,
        },
      },
    },
    async (request) => {
      return getCharacters(request.query);
    }
  );
};
