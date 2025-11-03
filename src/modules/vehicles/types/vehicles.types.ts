import { z } from "zod";
import {
  vehicleSchema,
  vehicleQueryParamsSchema,
  vehicleIdParamSchema,
} from "../schemas/vehicles.schema";

// Inferred types from Zod schemas
export type Vehicle = z.infer<typeof vehicleSchema>;
export type CreateVehicleData = Omit<Vehicle, "id">;
export type VehicleQueryParams = z.infer<typeof vehicleQueryParamsSchema>;
export type VehicleIdParam = z.infer<typeof vehicleIdParamSchema>;

// Response types
export interface VehiclesResponse {
  vehicles: Vehicle[];
  total: number;
}

export interface VehicleResponse {
  vehicle: Vehicle;
}

// Repository types
export interface VehicleFilters {
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: keyof Vehicle;
}
