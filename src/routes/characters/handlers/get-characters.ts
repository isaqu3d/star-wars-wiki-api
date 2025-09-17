import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import {
  characterQueryParamsSchema,
  charactersResponseSchema,
} from "../character.schemas";
import { getCharacters } from "../character.services";

const querySchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(["name", "id", "height", "mass"]).optional().default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

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
