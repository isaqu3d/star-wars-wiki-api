import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "../../../config/database";
import { starships } from "../../../database/schema";
import {
  Starship,
  StarshipFilters,
  CreateStarshipData,
} from "../types/starships.types";

export class StarshipRepository {
  /**
   * Find all starships with pagination and filtering
   */
  async findAll(
    filters: StarshipFilters = {}
  ): Promise<{ data: Starship[]; total: number }> {
    const { search, limit = 10, offset = 0, orderBy = "id" } = filters;

    const conditions = search ? [ilike(starships.name, `%${search}%`)] : [];

    const [data, total] = await Promise.all([
      db
        .select()
        .from(starships)
        .where(and(...conditions))
        .orderBy(asc(starships[orderBy]))
        .limit(limit)
        .offset(offset),

      db.$count(starships, and(...conditions)),
    ]);

    return { data, total };
  }

  /**
   * Find starship by ID
   */
  async findById(id: number): Promise<Starship | null> {
    const [starship] = await db
      .select()
      .from(starships)
      .where(eq(starships.id, id));

    return starship || null;
  }

  /**
   * Create a new starship
   */
  async create(data: CreateStarshipData): Promise<Starship> {
    const [starship] = await db.insert(starships).values(data).returning();

    return starship;
  }

  /**
   * Update starship by ID
   */
  async update(
    id: number,
    data: Partial<CreateStarshipData>
  ): Promise<Starship | null> {
    const [starship] = await db
      .update(starships)
      .set(data)
      .where(eq(starships.id, id))
      .returning();

    return starship || null;
  }

  /**
   * Delete starship by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(starships)
      .where(eq(starships.id, id))
      .returning({ id: starships.id });

    return result.length > 0;
  }

  /**
   * Check if starship exists
   */
  async exists(id: number): Promise<boolean> {
    const [starship] = await db
      .select({ id: starships.id })
      .from(starships)
      .where(eq(starships.id, id))
      .limit(1);

    return !!starship;
  }
}
