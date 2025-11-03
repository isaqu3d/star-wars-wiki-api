import { StarshipRepository } from "../repositories/starships.repository";
import {
  Starship,
  StarshipQueryParams,
  CreateStarshipData,
} from "../types/starships.types";

export class StarshipService {
  private repository: StarshipRepository;

  constructor() {
    this.repository = new StarshipRepository();
  }

  /**
   * Get all starships with pagination and filters
   */
  async getStarships(
    params: StarshipQueryParams
  ): Promise<{ data: Starship[]; total: number }> {
    const { page = 1, limit = 10, search, orderBy = "id" } = params;
    const offset = (page - 1) * limit;

    return await this.repository.findAll({
      search,
      limit,
      offset,
      orderBy,
    });
  }

  /**
   * Get starship by ID
   */
  async getStarshipById(id: number): Promise<Starship | null> {
    return await this.repository.findById(id);
  }

  /**
   * Create a new starship
   */
  async createStarship(data: CreateStarshipData): Promise<Starship> {
    return await this.repository.create(data);
  }

  /**
   * Update starship
   */
  async updateStarship(
    id: number,
    data: Partial<CreateStarshipData>
  ): Promise<Starship | null> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      return null;
    }

    return await this.repository.update(id, data);
  }

  /**
   * Delete starship
   */
  async deleteStarship(id: number): Promise<boolean> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      return false;
    }

    return await this.repository.delete(id);
  }
}
