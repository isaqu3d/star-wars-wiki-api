import { z } from "zod";

/**
 * Base film schema
 */
export const filmSchema = z.object({
  id: z.number(),
  title: z.string(),
  episode_id: z.number().nullable(),
  opening_crawl: z.string().nullable(),
  director: z.string().nullable(),
  producer: z.string().nullable(),
  release_date: z.string().nullable(),
});

/**
 * Route schemas
 */
export const filmIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const filmQueryParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["title", "id", "episode_id", "release_date"])
    .optional()
    .default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

/**
 * Response schemas
 */
export const filmResponseSchema = z.object({
  film: filmSchema,
});

export const filmsResponseSchema = z.object({
  films: z.array(filmSchema),
  total: z.number(),
});