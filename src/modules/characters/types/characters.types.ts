import { z } from "zod";
import {
  characterSchema,
  createCharacterBodySchema,
  characterQueryParamsSchema,
  characterIdParamSchema
} from "../schemas/characters.schema";

// Inferred types from Zod schemas
export type Character = z.infer<typeof characterSchema>;
export type CreateCharacterData = z.infer<typeof createCharacterBodySchema>;
export type CharacterQueryParams = z.infer<typeof characterQueryParamsSchema>;
export type CharacterIdParam = z.infer<typeof characterIdParamSchema>;

// Response types
export interface CharactersResponse {
  characters: Character[];
  total: number;
}

export interface CharacterResponse {
  character: Character;
}

// Repository types
export interface CharacterFilters {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: keyof Character;
}