"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesResponseSchema = exports.vehicleResponseSchema = exports.vehicleQueryParamsSchema = exports.vehicleIdParamSchema = exports.vehicleSchema = void 0;
const zod_1 = require("zod");
/**
 * Base vehicle schema
 */
exports.vehicleSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    model: zod_1.z.string().nullable(),
    manufacturer: zod_1.z.string().nullable(),
    cost_in_credits: zod_1.z.string().nullable(),
    length: zod_1.z.string().nullable(),
    max_atmosphering_speed: zod_1.z.string().nullable(),
    crew: zod_1.z.string().nullable(),
    passengers: zod_1.z.string().nullable(),
    cargo_capacity: zod_1.z.string().nullable(),
    consumables: zod_1.z.string().nullable(),
    vehicle_class: zod_1.z.string().nullable(),
});
/**
 * Route schemas
 */
exports.vehicleIdParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number(),
});
exports.vehicleQueryParamsSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    orderBy: zod_1.z
        .enum(["name", "id", "model", "manufacturer"])
        .optional()
        .default("id"),
    page: zod_1.z.coerce.number().optional().default(1),
    limit: zod_1.z.coerce.number().optional().default(10),
});
/**
 * Response schemas
 */
exports.vehicleResponseSchema = zod_1.z.object({
    vehicle: exports.vehicleSchema,
});
exports.vehiclesResponseSchema = zod_1.z.object({
    vehicles: zod_1.z.array(exports.vehicleSchema),
    total: zod_1.z.number(),
});
