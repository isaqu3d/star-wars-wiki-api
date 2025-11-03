import { FastifyRequest, FastifyReply } from "fastify";
import { VehicleService } from "../services/vehicles.service";
import {
  vehicleQueryParamsSchema,
  createVehicleBodySchema,
  updateVehicleSchema,
} from "../schemas/vehicles.schema";
import { NotFoundError } from "../../../shared/errors/AppError";

export class VehicleController {
  private service: VehicleService;

  constructor() {
    this.service = new VehicleService();
  }

  /**
   * Get all vehicles
   */
  async getVehicles(request: FastifyRequest, reply: FastifyReply) {
    const filters = vehicleQueryParamsSchema.parse(request.query);
    const { data, total } = await this.service.getVehicles(filters);

    return reply.send({ vehicles: data, total });
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const vehicle = await this.service.getVehicleById(id);

    if (!vehicle) {
      throw new NotFoundError("Vehicle", id);
    }

    return reply.send({ vehicle });
  }

  /**
   * Create new vehicle
   */
  async createVehicle(request: FastifyRequest, reply: FastifyReply) {
    const data = createVehicleBodySchema.parse(request.body);
    const vehicle = await this.service.createVehicle(data);

    return reply.status(201).send({ vehicle });
  }

  /**
   * Update vehicle
   */
  async updateVehicle(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const data = updateVehicleSchema.parse(request.body);
    const vehicle = await this.service.updateVehicle(id, data);

    if (!vehicle) {
      throw new NotFoundError("Vehicle", id);
    }

    return reply.send({ vehicle });
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const deleted = await this.service.deleteVehicle(id);

    if (!deleted) {
      throw new NotFoundError("Vehicle", id);
    }

    return reply.status(204).send();
  }
}
