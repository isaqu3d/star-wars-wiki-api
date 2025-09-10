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
