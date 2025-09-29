import { and, asc, eq, ilike } from "drizzle-orm";
import z from "zod";
import { db } from "../../config/database";
import { characters } from "../../database/schema";
import {
  characterIdParamSchema,
  characterQueryParamsSchema,
  createCharacterBodySchema,
} from "./character.schema";

export async function getCharacters(
  query: z.infer<typeof characterQueryParamsSchema>
) {
  const { search, limit, orderBy, page } = query;

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

export async function getCharacterById(
  characterId: z.infer<typeof characterIdParamSchema>["id"]
) {
  const result = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId));
  return result[0] ?? null;
}

export async function createCharacter(
  data: z.infer<typeof createCharacterBodySchema>
) {
  const [newCharacter] = await db.insert(characters).values(data).returning();
  return newCharacter;
}

export async function deleteCharacter(
  characterId: z.infer<typeof characterIdParamSchema>["id"]
) {
  const result = await db
    .delete(characters)
    .where(eq(characters.id, characterId))
    .returning();

  return result.length > 0;
}

export async function updateCharacter(
  characterId: z.infer<typeof characterIdParamSchema>["id"],
  data: z.infer<typeof createCharacterBodySchema>
) {
  const [updatedCharacter] = await db
    .update(characters)
    .set(data)
    .where(eq(characters.id, characterId))
    .returning();

  return updatedCharacter;
}
