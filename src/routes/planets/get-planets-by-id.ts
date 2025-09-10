import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client";
import { planets } from "../../database/schema";

export const GetPlanetsByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/planets/:id",
    {
      schema: {
        tags: ["Planets"],
        summary: "Get a planet by ID",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            planet: z.object({
              id: z.number(),
              name: z.string(),
              rotation_period: z.string().nullable(),
              orbital_period: z.string().nullable(),
              diameter: z.string().nullable(),
              climate: z.string().nullable(),
              gravity: z.string().nullable(),
              terrain: z.string().nullable(),
              surface_water: z.string().nullable(),
              population: z.string().nullable(),
            }),
          }),
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z.object({ message: z.string() }).describe("Planet not found"),
        },
      },
    },
    async (request, reply) => {
      const planetsId = request.params.id;

      const result = await db
        .select()
        .from(planets)
        .where(eq(planets.id, planetsId));

      if (result.length === 0) {
        return reply.status(404).send({ message: "Planet not found" });
      }

      return reply.send({ planet: result[0] });
    }
  );
};
