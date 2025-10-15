import { FastifyReply, FastifyRequest } from "fastify";
import { planetQueryParamsSchema } from "../schemas/planets.schema";
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
}
