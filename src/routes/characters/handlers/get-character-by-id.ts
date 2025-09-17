import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import {
  characterIdParamSchema,
  characterResponseSchema,
} from "../character.schemas";
import { getCharacterById } from "../character.services";

export const getCharacterByIdHandler: FastifyPluginAsyncZod = async (
  server
) => {
  server.get(
    "/characters/:id",
    {
      schema: {
        tags: ["Characters"],
        summary: "Get a character by ID",
        params: characterIdParamSchema,
        response: {
          200: characterResponseSchema,
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z
            .object({ message: z.string() })
            .describe("Character not found"),
        },
      },
    },
    async (request, reply) => {
      const character = await getCharacterById(request.params.id);

      if (!character) {
        return reply.status(404).send({ message: "Character not found" });
      }

      return { character };
    }
  );
};
