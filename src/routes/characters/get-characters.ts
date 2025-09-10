import { and, asc, ilike } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client";
import { characters } from "../../database/schema";

const querySchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(["name", "id", "height", "mass"]).optional().default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

export const GetCharactersRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/characters",
    {
      schema: {
        tags: ["Characters"],
        summary: "Get all characters with pagination and search",
        querystring: querySchema,
        response: {
          200: z.object({
            characters: z.array(
              z.object({
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
                image_url: z.string(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page, limit } = querySchema.parse(request.query);

      const conditions = search ? [ilike(characters.name, `%${search}%`)] : [];

      const [result, total] = await Promise.all([
        db
          .select()
          .from(characters)
          .where(and(...conditions))
          .orderBy(asc(characters[orderBy]))
          .limit(limit)
          .offset((page - 1) * limit),

        db.$count(characters, and(...conditions)),
      ]);

      return { characters: result, total };
    }
  );
};
