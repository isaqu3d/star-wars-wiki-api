import { and, asc, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../config/database";
import { vehicles } from "../../database/schema";
import {
  vehicleIdParamSchema,
  vehicleQueryParamsSchema,
} from "./vehicle.schema";

export async function getVehicles(
  query: z.infer<typeof vehicleQueryParamsSchema>
) {
  const { search, page, orderBy, limit } = query;

  const conditions = search ? [ilike(vehicles.name, `%${search}%`)] : [];

  const [result, total] = await Promise.all([
    db
      .select()
      .from(vehicles)
      .where(and(...conditions))
      .orderBy(asc(vehicles[orderBy]))
      .limit(limit)
      .offset((page - 1) * limit),

    db.$count(vehicles, and(...conditions)),
  ]);

  return { vehicles: result, total };
}

export async function getVehicleById(
  vehicleId: z.infer<typeof vehicleIdParamSchema>["id"]
) {
  const result = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, vehicleId));

  return result[0] ?? null;
}