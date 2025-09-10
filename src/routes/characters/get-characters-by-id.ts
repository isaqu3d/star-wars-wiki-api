import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client";
import { characters } from "../../database/schema";

export const GetCharactersByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/characters/:id",
    {
      schema: {
        tags: ["Characters"],
        summary: "Get a character by ID",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            character: z.object({
              id: z.number(),
              name: z.string(),
              height: z.string().nullable(),
              mass: z.string().nullable(),
              hair_color: z.string().nullable(),
              skin_color: z.string().nullable(),
              eye_color: z.string().nullable(),
              birth_year: z.string().nullable(),
              gender: z.string().nullable(),
              homeworld_id: z.number().nullable(),
              image_url: z.string().nullable(),
            }),
          }),
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z.null().describe("Character not found"),
        },
      },
    },
    async (request, reply) => {
      const characterId = Number(request.params.id);

      if (isNaN(characterId)) {
        return reply.status(400).send({ error: "Invalid character ID" });
      }

      const characterResult = await db
        .select()
        .from(characters)
        .where(eq(characters.id, characterId));

      if (characterResult.length === 0) {
        return reply.status(404).send(null);
      }

      const character = characterResult[0];

      return { character };
    }
  );
};
