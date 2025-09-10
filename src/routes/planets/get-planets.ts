import { and, asc, ilike } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";
import z from "zod";
import { db } from "../../database/client";
import { planets } from "../../database/schema";

const querySchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["name", "id", "diameter", "population"])
    .optional()
    .default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

export const GetPlanetsRoute: FastifyPluginAsync = async (server) => {
  server.get(
    "/planets",
    {
      schema: {
        tags: ["Planets"],
        summary: "Get all planets",
        querystring: querySchema,
        response: {
          200: z.object({
            planets: z.array(
              z.object({
                id: z.number(),
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
      const { search, page, orderBy, limit } = querySchema.parse(request.query);

      const conditions = search ? [ilike(planets.name, `%${search}%`)] : [];

      const [result, total] = await Promise.all([
        db
          .select()
          .from(planets)
          .where(and(...conditions))
          .orderBy(asc(planets[orderBy]))
          .limit(limit)
          .offset((page - 1) * limit),

        db.$count(planets, and(...conditions)),
      ]);

      return { planets: result, total };
    }
  );
};
