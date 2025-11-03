import { z } from "zod";

/**
 * Base vehicle schema
 */
export const vehicleSchema = z.object({
  id: z.number(),
  name: z.string(),
  model: z.string().nullable(),
  manufacturer: z.string().nullable(),
  cost_in_credits: z.string().nullable(),
  length: z.string().nullable(),
  max_atmosphering_speed: z.string().nullable(),
  crew: z.string().nullable(),
  passengers: z.string().nullable(),
  cargo_capacity: z.string().nullable(),
  consumables: z.string().nullable(),
  vehicle_class: z.string().nullable(),
});

/**
 * Create and update schemas
 */
export const createVehicleBodySchema = vehicleSchema.omit({ id: true });
export const updateVehicleSchema = createVehicleBodySchema.partial();

/**
 * Route parameter schemas
 */
export const vehicleIdParamSchema = z.object({
  id: z.coerce.number(),
});

export const vehicleQueryParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["name", "id", "model", "manufacturer"])
    .optional()
    .default("id"),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

/**
 * Response schemas
 */
export const vehicleResponseSchema = z.object({
  vehicle: vehicleSchema,
});

export const vehiclesResponseSchema = z.object({
  vehicles: z.array(vehicleSchema),
  total: z.number(),
});
