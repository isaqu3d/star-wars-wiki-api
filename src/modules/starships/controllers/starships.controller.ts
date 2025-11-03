import { FastifyRequest, FastifyReply } from "fastify";
import { StarshipService } from "../services/starships.service";
import {
  starshipQueryParamsSchema,
  createStarshipBodySchema,
  updateStarshipSchema,
} from "../schemas/starships.schema";
import { NotFoundError } from "../../../shared/errors/AppError";

export class StarshipController {
  private service: StarshipService;

  constructor() {
    this.service = new StarshipService();
  }

  /**
   * Get all starships
   */
  async getStarships(request: FastifyRequest, reply: FastifyReply) {
    const filters = starshipQueryParamsSchema.parse(request.query);
    const { data, total } = await this.service.getStarships(filters);

    return reply.send({ starships: data, total });
  }

  /**
   * Get starship by ID
   */
  async getStarshipById(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const starship = await this.service.getStarshipById(id);

    if (!starship) {
      throw new NotFoundError("Starship", id);
    }

    return reply.send({ starship });
  }

  /**
   * Create new starship
   */
  async createStarship(request: FastifyRequest, reply: FastifyReply) {
    const data = createStarshipBodySchema.parse(request.body);
    const starship = await this.service.createStarship(data);

    return reply.status(201).send({ starship });
  }

  /**
   * Update starship
   */
  async updateStarship(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const data = updateStarshipSchema.parse(request.body);
    const starship = await this.service.updateStarship(id, data);

    if (!starship) {
      throw new NotFoundError("Starship", id);
    }

    return reply.send({ starship });
  }

  /**
   * Delete starship
   */
  async deleteStarship(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const deleted = await this.service.deleteStarship(id);

    if (!deleted) {
      throw new NotFoundError("Starship", id);
    }

    return reply.status(204).send();
  }
}
