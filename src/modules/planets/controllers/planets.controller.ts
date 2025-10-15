import { FastifyReply, FastifyRequest } from "fastify";
import {
  createPlanetBodySchema,
  planetIdParamSchema,
  planetQueryParamsSchema,
} from "../schemas/planets.schema";
import { PlanetService } from "../services/planets.service";

export class PlanetController {
  private planetService: PlanetService;

  constructor() {
    this.planetService = new PlanetService();
  }

  async getPlanets(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = planetQueryParamsSchema.parse(request.query);
      const result = await this.planetService.getPlanets(query);
      return reply.send(result);
    } catch (error) {
      return reply.status(400).send({ error: "Invalid query parameters" });
    }
  }

  async getPlanetById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = planetIdParamSchema.parse(request.params);
      const planet = await this.planetService.getPlanetById(id);

      if (!planet) {
        return reply.status(404).send({ message: "Planet not found" });
      }

      return reply.send({ planet });
    } catch (error) {
      return reply.status(400).send({ error: "Invalid planet ID" });
    }
  }

  async createPlanet(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createPlanetBodySchema.parse(request.body);
      const planet = await this.planetService.createPlanet(data);
      return reply.status(201).send({ planet });
    } catch (error) {
      return reply.status(400).send({ error: "Invalid planet data" });
    }
  }

  async updatePlanet(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = planetIdParamSchema.parse(request.params);
      const data = createPlanetBodySchema.parse(request.body);

      const planet = await this.planetService.updatePlanet(id, data);

      if (!planet) {
        return reply.status(404).send({ message: "Planet not found" });
      }

      return reply.send({ planet });
    } catch (error) {
      return reply.status(400).send({ error: "Invalid request data" });
    }
  }

  async deletePlanet(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = planetIdParamSchema.parse(request.params);
      const success = await this.planetService.deletePlanet(id);

      if (!success) {
        return reply.status(404).send({ message: "Planet not found" });
      }

      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ error: "Invalid Planet ID" });
    }
  }
}
