import z from "zod";
import {
  createPlanetBodySchema,
  planetIdParamSchema,
  planetQueryParamsSchema,
  planetSchema,
} from "../schemas/planets.schema";

export type Planet = z.infer<typeof planetSchema>;
export type CreatePlanetData = z.infer<typeof createPlanetBodySchema>;
export type planetQueryParams = z.infer<typeof planetQueryParamsSchema>;
export type PlanetIdParam = z.infer<typeof planetIdParamSchema>;

export interface PlanetsResponse {
  planets: Planet[];
  total: number;
}

export interface PlanetResponse {
  planet: Planet;
}

export interface PlanetFilters {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: keyof Planet;
}
