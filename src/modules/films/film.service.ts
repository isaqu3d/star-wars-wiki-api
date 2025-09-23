import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../config/database";
import { films } from "../../database/schema";
import {
  filmIdParamSchema,
  filmQueryParamsSchema,
} from "./film.schema";

export async function getFilms(
  query: z.infer<typeof filmQueryParamsSchema>
) {
  const { search, page, orderBy, limit } = query;

  const conditions = search ? [ilike(films.title, `%${search}%`)] : [];

  const [result, total] = await Promise.all([
    db
      .select()
      .from(films)
      .where(and(...conditions))
      .orderBy(asc(films[orderBy]))
      .limit(limit)
      .offset((page - 1) * limit),

    db.$count(films, and(...conditions)),
  ]);

  return { films: result, total };
}

export async function getFilmById(
  filmId: z.infer<typeof filmIdParamSchema>["id"]
) {
  const result = await db
    .select()
    .from(films)
    .where(eq(films.id, filmId));

  return result[0] ?? null;
}