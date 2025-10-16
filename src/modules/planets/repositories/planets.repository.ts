import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "../../../config/database";
import { planets } from "../../../database/schema";
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

  async findById(id: number): Promise<Planet | null> {
    const [planet] = await db.select().from(planets).where(eq(planets.id, id));

    return planet || null;
  }

  async findByName(name: string): Promise<Planet[]> {
    return await db
      .select()
      .from(planets)
      .where(ilike(planets.name, `%${name}%`));
  }

  async create(data: Omit<Planet, "id">): Promise<Planet> {
    const [planet] = await db.insert(planets).values(data).returning();

    return planet;
  }

  async update(
    id: number,
    data: Partial<Omit<Planet, "id">>
  ): Promise<Planet | null> {
    const [planet] = await db
      .update(planets)
      .set(data)
      .where(eq(planets.id, id))
      .returning();

    return planet || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(planets)
      .where(eq(planets.id, id))
      .returning({ id: planets.id });

    return result.length > 0;
  }

  async exists(id: number): Promise<boolean> {
    const [planet] = await db
      .select()
      .from(planets)
      .where(eq(planets.id, id))
      .limit(1);

    return !!planet;
  }
}
