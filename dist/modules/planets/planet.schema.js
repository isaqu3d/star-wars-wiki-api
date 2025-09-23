"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planetsResponseSchema = exports.planetResponseSchema = exports.planetQueryParamsSchema = exports.planetIdParamSchema = exports.planetSchema = void 0;
const zod_1 = require("zod");
/**
 * Base planet schema
 */
exports.planetSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    rotation_period: zod_1.z.string().nullable(),
    orbital_period: zod_1.z.string().nullable(),
    diameter: zod_1.z.string().nullable(),
    climate: zod_1.z.string().nullable(),
    gravity: zod_1.z.string().nullable(),
    terrain: zod_1.z.string().nullable(),
    surface_water: zod_1.z.string().nullable(),
    population: zod_1.z.string().nullable(),
});
/**
 * Route schemas
 */
exports.planetIdParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number(),
});
exports.planetQueryParamsSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    orderBy: zod_1.z
        .enum(["name", "id", "diameter", "population"])
        .optional()
        .default("id"),
    page: zod_1.z.coerce.number().optional().default(1),
    limit: zod_1.z.coerce.number().optional().default(10),
});
/**
 * Response schemas
 */
exports.planetResponseSchema = zod_1.z.object({
    planet: exports.planetSchema,
});
exports.planetsResponseSchema = zod_1.z.object({
    planets: zod_1.z.array(exports.planetSchema),
    total: zod_1.z.number(),
});
