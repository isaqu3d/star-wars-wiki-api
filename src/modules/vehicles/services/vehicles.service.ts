import { VehicleRepository } from "../repositories/vehicles.repository";
import {
  Vehicle,
  VehicleQueryParams,
  CreateVehicleData,
} from "../types/vehicles.types";

export class VehicleService {
  private repository: VehicleRepository;

  constructor() {
    this.repository = new VehicleRepository();
  }

  /**
   * Get all vehicles with pagination and filters
   */
  async getVehicles(
    params: VehicleQueryParams
  ): Promise<{ data: Vehicle[]; total: number }> {
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
   * Get vehicle by ID
   */
  async getVehicleById(id: number): Promise<Vehicle | null> {
    return await this.repository.findById(id);
  }

  /**
   * Create a new vehicle
   */
  async createVehicle(data: CreateVehicleData): Promise<Vehicle> {
    return await this.repository.create(data);
  }

  /**
   * Update vehicle
   */
  async updateVehicle(
    id: number,
    data: Partial<CreateVehicleData>
  ): Promise<Vehicle | null> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      return null;
    }

    return await this.repository.update(id, data);
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(id: number): Promise<boolean> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      return false;
    }

    return await this.repository.delete(id);
  }
}
