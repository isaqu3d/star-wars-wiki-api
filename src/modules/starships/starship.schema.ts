import { z } from "zod";

/**
 * Base starship schema
 */
export const starshipSchema = z.object({
  id: z.number(),
  name: z.string(),
  model: z.string().nullable(),
  manufacturer: z.string().nullable(),
  cost_in_credits: z.string().nullable(),
  length: z.string().nullable(),
  max_atmosphering_speed: z.string().nullable(),
  crew: z.string().nullable(),
  passengers: z.string().nullable(),
  cargo_capacity: z.string().nullable(),
  consumables: z.string().nullable(),
  hyperdrive_rating: z.string().nullable(),
  MGLT: z.string().nullable(),
  starship_class: z.string().nullable(),
});

/**
 * Route schemas
 */
export const starshipIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const starshipQueryParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["name", "id", "model", "manufacturer"])
    .optional()
    .default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

/**
 * Response schemas
 */
export const starshipResponseSchema = z.object({
  starship: starshipSchema,
});

export const starshipsResponseSchema = z.object({
  starships: z.array(starshipSchema),
  total: z.number(),
});