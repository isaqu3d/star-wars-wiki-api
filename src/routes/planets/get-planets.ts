import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { db } from "../../database/client";
import { planets } from "../../database/schema";

export const GetPlanetsRoute: FastifyPluginAsync = async (server) => {
  server.get(
    "/planets",
    {
      schema: {
        tags: ["Planets"],
        summary: "Get all planets",
        response: {
          200: z.object({
            planets: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                rotation_period: z.string(),
                orbital_period: z.string(),
                diameter: z.string(),
                climate: z.string(),
                gravity: z.string(),
                terrain: z.string(),
                surface_water: z.string(),
                population: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await db.select().from(planets);

      return reply.send({ planets: result });
    }
  );
};
