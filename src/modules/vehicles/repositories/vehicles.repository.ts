import { and, asc, eq, ilike } from "drizzle-orm";
import { db } from "../../../config/database";
import { vehicles } from "../../../database/schema";
import {
  Vehicle,
  VehicleFilters,
  CreateVehicleData,
} from "../types/vehicles.types";

export class VehicleRepository {
  /**
   * Find all vehicles with pagination and filtering
   */
  async findAll(
    filters: VehicleFilters = {}
  ): Promise<{ data: Vehicle[]; total: number }> {
    const { search, limit = 10, offset = 0, orderBy = "id" } = filters;

    const conditions = search ? [ilike(vehicles.name, `%${search}%`)] : [];

    const [data, total] = await Promise.all([
      db
        .select()
        .from(vehicles)
        .where(and(...conditions))
        .orderBy(asc(vehicles[orderBy]))
        .limit(limit)
        .offset(offset),

      db.$count(vehicles, and(...conditions)),
    ]);

    return { data, total };
  }

  /**
   * Find vehicle by ID
   */
  async findById(id: number): Promise<Vehicle | null> {
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id));

    return vehicle || null;
  }

  /**
   * Create a new vehicle
   */
  async create(data: CreateVehicleData): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(data).returning();

    return vehicle;
  }

  /**
   * Update vehicle by ID
   */
  async update(
    id: number,
    data: Partial<CreateVehicleData>
  ): Promise<Vehicle | null> {
    const [vehicle] = await db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, id))
      .returning();

    return vehicle || null;
  }

  /**
   * Delete vehicle by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning({ id: vehicles.id });

    return result.length > 0;
  }

  /**
   * Check if vehicle exists
   */
  async exists(id: number): Promise<boolean> {
    const [vehicle] = await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1);

    return !!vehicle;
  }
}
