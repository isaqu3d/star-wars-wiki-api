import { db } from "@/config/database";
import { planets } from "@/database/schema";
import { and, asc, ilike } from "drizzle-orm";
import { Planet, PlanetFilters } from "../types/planets.types";

export class PlanetRepository {
  async findAll(
    filters: PlanetFilters = {}
  ): Promise<{ data: Planet[]; total: number }> {
    const { search, limit = 10, offset = 0, orderBy = "id" } = filters;

    const conditions = search ? [ilike(planets.name, `%${search}%`)] : [];

    const [data, total] = await Promise.all([
      db
        .select()
        .from(planets)
        .where(and(...conditions))
        .orderBy(asc(planets[orderBy]))
        .limit(limit)
        .offset(offset),

      db.$count(planets, and(...conditions)),
    ]);
    return { data, total };
  }
}
