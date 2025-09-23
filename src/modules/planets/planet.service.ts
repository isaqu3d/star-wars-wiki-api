import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../config/database";
import { planets } from "../../database/schema";
import {
  planetIdParamSchema,
  planetQueryParamsSchema,
} from "./planet.schema";

export async function getPlanets(
  query: z.infer<typeof planetQueryParamsSchema>
) {
  const { search, page, orderBy, limit } = query;

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

export async function getPlanetById(
  planetId: z.infer<typeof planetIdParamSchema>["id"]
) {
  const result = await db
    .select()
    .from(planets)
    .where(eq(planets.id, planetId));

  return result[0] ?? null;
}