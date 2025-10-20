import z from "zod";

export const filmsSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255),
  episode_id: z.number(),
  opening_crawl: z.string().nullable(),
  director: z.string().min(1).max(255),
  producer: z.string().min(1).max(255),
  release_date: z.string(),
});

export const createFilmSchema = filmsSchema.omit({ id: true });

export const updateFilmSchema = createFilmSchema.partial();

export const filmIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const filmQueryParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["title", "release_date", "episode_id", "id"])
    .optional()
    .default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

export const filmResponseSchema = z.object({
  film: filmsSchema,
});

export const filmsResponseSchema = z.object({
  films: z.array(filmsSchema),
  total: z.number(),
});
