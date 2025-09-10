import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client";
import { characters } from "../../database/schema";

export const GetCharactersById: FastifyPluginAsyncZod = async (server) => {
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
              height: z.string(),
              mass: z.string(),
              hair_color: z.string(),
              skin_color: z.string(),
              eye_color: z.string(),
              birth_year: z.string(),
              gender: z.string(),
              homeworld: z
                .object({
                  id: z.number(),
                  name: z.string(),
                })
                .nullable(),

              vehicles: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                  model: z.string(),
                })
              ),

              starships: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                  model: z.string(),
                })
              ),

              films: z.array(
                z.object({
                  id: z.number(),
                  title: z.string(),
                  episode_id: z.number(),
                })
              ),
            }),
          }),
          400: z
            .object({
              error: z.string(),
            })
            .describe("Invalid request"),
          404: z.null().describe("Character not found"),
        },
      },
    },
    async (request, reply) => {
      const characterId = Number(request.params.id);

      if (isNaN(characterId)) {
        return reply.status(400).send({ error: "Invalid character ID" });
      }

      const character = await db
        .select()
        .from(characters)
        .where(eq(characters.id, characterId));

      if (!character) {
        return reply.status(404).send(null);
      }
    }
  );
};
