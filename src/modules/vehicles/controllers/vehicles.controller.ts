import { FastifyRequest, FastifyReply } from "fastify";
import { VehicleService } from "../services/vehicles.service";
import {
  vehicleQueryParamsSchema,
  createVehicleBodySchema,
  updateVehicleSchema,
} from "../schemas/vehicles.schema";

export class VehicleController {
  private service: VehicleService;

  constructor() {
    this.service = new VehicleService();
  }

  /**
   * Get all vehicles
   */
  async getVehicles(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filters = vehicleQueryParamsSchema.parse(request.query);
      const { data, total } = await this.service.getVehicles(filters);

      return reply.send({ vehicles: data, total });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch vehicles" });
    }
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const vehicle = await this.service.getVehicleById(id);

      if (!vehicle) {
        return reply.status(404).send({ error: "Vehicle not found" });
      }

      return reply.send({ vehicle });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch vehicle" });
    }
  }

  /**
   * Create new vehicle
   */
  async createVehicle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createVehicleBodySchema.parse(request.body);
      const vehicle = await this.service.createVehicle(data);

      return reply.status(201).send({ vehicle });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to create vehicle" });
    }
  }

  /**
   * Update vehicle
   */
  async updateVehicle(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const data = updateVehicleSchema.parse(request.body);
      const vehicle = await this.service.updateVehicle(id, data);

      if (!vehicle) {
        return reply.status(404).send({ error: "Vehicle not found" });
      }

      return reply.send({ vehicle });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to update vehicle" });
    }
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const deleted = await this.service.deleteVehicle(id);

      if (!deleted) {
        return reply.status(404).send({ error: "Vehicle not found" });
      }

      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to delete vehicle" });
    }
  }
}
