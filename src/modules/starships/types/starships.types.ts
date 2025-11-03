import { z } from "zod";
import {
  starshipSchema,
  starshipQueryParamsSchema,
  starshipIdParamSchema,
} from "../schemas/starships.schema";

// Inferred types from Zod schemas
export type Starship = z.infer<typeof starshipSchema>;
export type CreateStarshipData = Omit<Starship, "id">;
export type StarshipQueryParams = z.infer<typeof starshipQueryParamsSchema>;
export type StarshipIdParam = z.infer<typeof starshipIdParamSchema>;

// Response types
export interface StarshipsResponse {
  starships: Starship[];
  total: number;
}

export interface StarshipResponse {
  starship: Starship;
}

// Repository types
export interface StarshipFilters {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: keyof Starship;
}
