import { z } from "zod";

/**
 * Base schema without id
 */
export const characterBaseSchema = z.object({
  name: z.string(),
  height: z.string().nullable(),
  mass: z.string().nullable(),
  hair_color: z.string().nullable(),
  skin_color: z.string().nullable(),
  eye_color: z.string().nullable(),
  birth_year: z.string().nullable(),
  gender: z.string().nullable(),
  homeworld_id: z.number().nullable(),
  image_url: z.string().nullable(),
});

/**
 * Complete character (with id)
 */
export const characterSchema = characterBaseSchema.extend({
  id: z.number(),
});

/**
 * Schemas for routes
 */
export const createCharacterBodySchema = characterBaseSchema.extend({
  image_url: z.string(), // required on creation
});

export const characterIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const characterQueryParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(["name", "id", "height", "mass"]).optional().default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

/**
 * Responses
 */
export const characterResponseSchema = z.object({
  character: characterSchema,
});

export const charactersResponseSchema = z.object({
  characters: z.array(characterSchema),
  total: z.number(),
});
