import { PlanetRepository } from "../repositories/planets.repository";
import {
  CreatePlanetData,
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

  async createPlanet(data: CreatePlanetData): Promise<Planet> {
    return await this.planetsRepository.create(data);
  }

  async updatePlanet(
    id: number,
    data: Partial<CreatePlanetData>
  ): Promise<Planet | null> {
    const existingPlanet = await this.planetsRepository.exists(id);
    if (!existingPlanet) {
      return null;
    }

    return await this.planetsRepository.update(id, data);
  }

  async deletePlanet(id: number): Promise<boolean> {
    return await this.planetsRepository.delete(id);
  }
}
