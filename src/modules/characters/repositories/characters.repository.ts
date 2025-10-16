import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "../../../config/database";
import { characters } from "../../../database/schema";
import {
  Character,
  CharacterFilters,
  CreateCharacterData,
} from "../types/characters.types";

export class CharacterRepository {
  /**
   * Find all characters with pagination and filtering
   */
  async findAll(
    filters: CharacterFilters = {}
  ): Promise<{ data: Character[]; total: number }> {
    const { search, limit = 10, offset = 0, orderBy = "id" } = filters;

    const conditions = search ? [ilike(characters.name, `%${search}%`)] : [];

    const [data, total] = await Promise.all([
      db
        .select()
        .from(characters)
        .where(and(...conditions))
        .orderBy(asc(characters[orderBy]))
        .limit(limit)
        .offset(offset),

      db.$count(characters, and(...conditions)),
    ]);

    return { data, total };
  }

  /**
   * Find character by ID
   */
  async findById(id: number): Promise<Character | null> {
    const [character] = await db
      .select()
      .from(characters)
      .where(eq(characters.id, id));

    return character || null;
  }

  /**
   * Find characters by name (partial search)
   */
  async findByName(name: string): Promise<Character[]> {
    return await db
      .select()
      .from(characters)
      .where(ilike(characters.name, `%${name}%`));
  }

  /**
   * Create a new character
   */
  async create(data: CreateCharacterData): Promise<Character> {
    const [character] = await db.insert(characters).values(data).returning();

    return character;
  }

  /**
   * Update character by ID
   */
  async update(
    id: number,
    data: Partial<CreateCharacterData>
  ): Promise<Character | null> {
    const [character] = await db
      .update(characters)
      .set(data)
      .where(eq(characters.id, id))
      .returning();

    return character || null;
  }

  /**
   * Delete character by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(characters)
      .where(eq(characters.id, id))
      .returning({ id: characters.id });

    return result.length > 0;
  }

  /**
   * Check if character exists
   */
  async exists(id: number): Promise<boolean> {
    const [character] = await db
      .select({ id: characters.id })
      .from(characters)
      .where(eq(characters.id, id))
      .limit(1);

    return !!character;
  }
}
