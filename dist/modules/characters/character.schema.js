"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.charactersResponseSchema = exports.characterResponseSchema = exports.characterQueryParamsSchema = exports.characterIdParamSchema = exports.createCharacterBodySchema = exports.characterSchema = exports.characterBaseSchema = void 0;
const zod_1 = require("zod");
/**
 * Base schema without id
 */
exports.characterBaseSchema = zod_1.z.object({
    name: zod_1.z.string(),
    height: zod_1.z.string().nullable(),
    mass: zod_1.z.string().nullable(),
    hair_color: zod_1.z.string().nullable(),
    skin_color: zod_1.z.string().nullable(),
    eye_color: zod_1.z.string().nullable(),
    birth_year: zod_1.z.string().nullable(),
    gender: zod_1.z.string().nullable(),
    homeworld_id: zod_1.z.number().nullable(),
    image_url: zod_1.z.string().nullable(),
});
/**
 * Complete character (with id)
 */
exports.characterSchema = exports.characterBaseSchema.extend({
    id: zod_1.z.number(),
});
/**
 * Schemas for routes
 */
exports.createCharacterBodySchema = exports.characterBaseSchema.extend({
    image_url: zod_1.z.string(), // required on creation
});
exports.characterIdParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number(),
});
exports.characterQueryParamsSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    orderBy: zod_1.z.enum(["name", "id", "height", "mass"]).optional().default("id"),
    page: zod_1.z.coerce.number().optional().default(1),
    limit: zod_1.z.coerce.number().optional().default(10),
});
/**
 * Responses
 */
exports.characterResponseSchema = zod_1.z.object({
    character: exports.characterSchema,
});
exports.charactersResponseSchema = zod_1.z.object({
    characters: zod_1.z.array(exports.characterSchema),
    total: zod_1.z.number(),
});
