import z from "zod";
import {
  createFilmBodySchema,
  filmIdParamSchema,
  filmQueryParamsSchema,
  filmsSchema,
} from "../schemas/films.schema";

export type Film = z.infer<typeof filmsSchema>;
export type CreateFilmData = z.infer<typeof createFilmBodySchema>;
export type FilmQueryParams = z.infer<typeof filmQueryParamsSchema>;
export type FilmIdParam = z.infer<typeof filmIdParamSchema>;

export interface FilmsResponse {
  films: Film[];
  total: number;
}

export interface FilmResponse {
  film: Film;
}

export interface FilmFilters {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: keyof Film;
}
