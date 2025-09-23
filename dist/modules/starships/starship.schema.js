"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starshipsResponseSchema = exports.starshipResponseSchema = exports.starshipQueryParamsSchema = exports.starshipIdParamSchema = exports.starshipSchema = void 0;
const zod_1 = require("zod");
/**
 * Base starship schema
 */
exports.starshipSchema = zod_1.z.object({
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
    hyperdrive_rating: zod_1.z.string().nullable(),
    MGLT: zod_1.z.string().nullable(),
    starship_class: zod_1.z.string().nullable(),
});
/**
 * Route schemas
 */
exports.starshipIdParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number(),
});
exports.starshipQueryParamsSchema = zod_1.z.object({
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
exports.starshipResponseSchema = zod_1.z.object({
    starship: exports.starshipSchema,
});
exports.starshipsResponseSchema = zod_1.z.object({
    starships: zod_1.z.array(exports.starshipSchema),
    total: zod_1.z.number(),
});
