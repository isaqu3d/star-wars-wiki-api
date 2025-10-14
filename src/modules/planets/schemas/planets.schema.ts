import { z } from "zod";

/**
 * Base planet schema
 */
export const planetSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255),
  rotation_period: z.string().nullable(),
  orbital_period: z.string().nullable(),
  diameter: z.string().nullable(),
  climate: z.string().nullable(),
  gravity: z.string().nullable(),
  terrain: z.string().nullable(),
  surface_water: z.string().nullable(),
  population: z.string().nullable(),
});

/**
 * Route schemas
 */

export const createPlanetBodySchema = planetSchema.omit({ id: true });

export const planetIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const planetQueryParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["name", "id", "diameter", "population"])
    .optional()
    .default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

/**
 * Response schemas
 */
export const planetResponseSchema = z.object({
  planet: planetSchema,
});

export const planetsResponseSchema = z.object({
  planets: z.array(planetSchema),
  total: z.number(),
});
