import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../config/database";
import { starships } from "../../database/schema";
import {
  starshipIdParamSchema,
  starshipQueryParamsSchema,
} from "./starship.schema";

export async function getStarships(
  query: z.infer<typeof starshipQueryParamsSchema>
) {
  const { search, page, orderBy, limit } = query;

  const conditions = search ? [ilike(starships.name, `%${search}%`)] : [];

  const [result, total] = await Promise.all([
    db
      .select()
      .from(starships)
      .where(and(...conditions))
      .orderBy(asc(starships[orderBy]))
      .limit(limit)
      .offset((page - 1) * limit),

    db.$count(starships, and(...conditions)),
  ]);

  return { starships: result, total };
}

export async function getStarshipById(
  starshipId: z.infer<typeof starshipIdParamSchema>["id"]
) {
  const result = await db
    .select()
    .from(starships)
    .where(eq(starships.id, starshipId));

  return result[0] ?? null;
}