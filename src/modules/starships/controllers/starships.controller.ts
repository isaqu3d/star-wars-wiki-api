import { FastifyRequest, FastifyReply } from "fastify";
import { StarshipService } from "../services/starships.service";
import {
  starshipQueryParamsSchema,
  createStarshipBodySchema,
  updateStarshipSchema,
} from "../schemas/starships.schema";

export class StarshipController {
  private service: StarshipService;

  constructor() {
    this.service = new StarshipService();
  }

  /**
   * Get all starships
   */
  async getStarships(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = starshipQueryParamsSchema.parse(request.query);
      const { data, total } = await this.service.getStarships(filters);

      return reply.send({ starships: data, total });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch starships" });
    }
  }

  /**
   * Get starship by ID
   */
  async getStarshipById(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const starship = await this.service.getStarshipById(id);

      if (!starship) {
        return reply.status(404).send({ error: "Starship not found" });
      }

      return reply.send({ starship });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch starship" });
    }
  }

  /**
   * Create new starship
   */
  async createStarship(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createStarshipBodySchema.parse(request.body);
      const starship = await this.service.createStarship(data);

      return reply.status(201).send({ starship });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to create starship" });
    }
  }

  /**
   * Update starship
   */
  async updateStarship(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const data = updateStarshipSchema.parse(request.body);
      const starship = await this.service.updateStarship(id, data);

      if (!starship) {
        return reply.status(404).send({ error: "Starship not found" });
      }

      return reply.send({ starship });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to update starship" });
    }
  }

  /**
   * Delete starship
   */
  async deleteStarship(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const deleted = await this.service.deleteStarship(id);

      if (!deleted) {
        return reply.status(404).send({ error: "Starship not found" });
      }

      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to delete starship" });
    }
  }
}
