import { db } from "@/config/database";

import { films } from "@/database/schema";
import { and, asc, eq, ilike } from "drizzle-orm";
import { Film, FilmFilters } from "../types/films.types";

export class FilmRepository {
  async findAll(
    filters: FilmFilters = {}
  ): Promise<{ data: Film[]; total: number }> {
    const { search, limit = 10, offset = 0, orderBy = "id" } = filters;

    const conditions = search ? [ilike(films.title, `%${search}%`)] : [];

    const [data, total] = await Promise.all([
      db
        .select()
        .from(films)
        .where(and(...conditions))
        .orderBy(asc(films[orderBy]))
        .limit(limit)
        .offset(offset),

      db.$count(films, and(...conditions)),
    ]);

    return { data, total };
  }

  async findById(id: number): Promise<Film | null> {
    const [film] = await db.select().from(films).where(eq(films.id, id));

    return film;
  }

  async findByTitle(title: string): Promise<Film[]> {
    return await db
      .select()
      .from(films)
      .where(ilike(films.title, `%${title}%`));
  }

  async create(data: Omit<Film, "id">): Promise<Film> {
    const [film] = await db.insert(films).values(data).returning();

    return film;
  }
}
