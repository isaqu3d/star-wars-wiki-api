// 1. 📁 ESTRUTURA DE PASTAS (base)
// 2. 📝 TYPES (contratos)
// 3. ✅ SCHEMAS (validação)
// 4. 🗄️ REPOSITORY (dados)
// 5. 🔧 SERVICE (lógica)
// 6. 🎮 CONTROLLER (interface)
// 7. 🛣️ ROUTES (mapeamento)
// 8. 🔗 REGISTRAR NO APP

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
