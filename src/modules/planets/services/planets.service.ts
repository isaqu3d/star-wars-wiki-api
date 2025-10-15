import { PlanetRepository } from "../repositories/planets.repository";
import {
  Planet,
  PlanetQueryParams,
  PlanetsResponse,
} from "../types/planets.types";

export class PlanetService {
  private planetsRepository: PlanetRepository;

  constructor() {
    this.planetsRepository = new PlanetRepository();
  }

  async getPlanets(query: PlanetQueryParams): Promise<PlanetsResponse> {
    const { search, limit, orderBy, page } = query;

    const filters = {
      search,
      limit,
      offset: (page - 1) * limit,
      orderBy,
    };

    const { data: planets, total } =
      await this.planetsRepository.findAll(filters);

    return { planets, total };
  }

  async getPlanetById(id: number): Promise<Planet | null> {
    return await this.planetsRepository.findById(id);
  }
}
