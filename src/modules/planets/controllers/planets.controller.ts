import { FastifyReply, FastifyRequest } from "fastify";
import {
  createPlanetBodySchema,
  planetIdParamSchema,
  planetQueryParamsSchema,
} from "../schemas/planets.schema";
import { PlanetService } from "../services/planets.service";
import { NotFoundError } from "../../../shared/errors/AppError";

export class PlanetController {
  private planetService: PlanetService;

  constructor() {
    this.planetService = new PlanetService();
  }

  async getPlanets(request: FastifyRequest, reply: FastifyReply) {
    const query = planetQueryParamsSchema.parse(request.query);
    const result = await this.planetService.getPlanets(query);
    return reply.send(result);
  }

  async getPlanetById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = planetIdParamSchema.parse(request.params);
    const planet = await this.planetService.getPlanetById(id);

    if (!planet) {
      throw new NotFoundError("Planet", id);
    }

    return reply.send({ planet });
  }

  async createPlanet(request: FastifyRequest, reply: FastifyReply) {
    const data = createPlanetBodySchema.parse(request.body);
    const planet = await this.planetService.createPlanet(data);
    return reply.status(201).send({ planet });
  }

  async updatePlanet(request: FastifyRequest, reply: FastifyReply) {
    const { id } = planetIdParamSchema.parse(request.params);
    const data = createPlanetBodySchema.parse(request.body);
    const planet = await this.planetService.updatePlanet(id, data);

    if (!planet) {
      throw new NotFoundError("Planet", id);
    }

    return reply.send({ planet });
  }

  async deletePlanet(request: FastifyRequest, reply: FastifyReply) {
    const { id } = planetIdParamSchema.parse(request.params);
    const success = await this.planetService.deletePlanet(id);

    if (!success) {
      throw new NotFoundError("Planet", id);
    }

    return reply.status(204).send();
  }
}
