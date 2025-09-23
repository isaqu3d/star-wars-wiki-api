"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filmsResponseSchema = exports.filmResponseSchema = exports.filmQueryParamsSchema = exports.filmIdParamSchema = exports.filmSchema = void 0;
const zod_1 = require("zod");
/**
 * Base film schema
 */
exports.filmSchema = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    episode_id: zod_1.z.number().nullable(),
    opening_crawl: zod_1.z.string().nullable(),
    director: zod_1.z.string().nullable(),
    producer: zod_1.z.string().nullable(),
    release_date: zod_1.z.string().nullable(),
});
/**
 * Route schemas
 */
exports.filmIdParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number(),
});
exports.filmQueryParamsSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    orderBy: zod_1.z
        .enum(["title", "id", "episode_id", "release_date"])
        .optional()
        .default("id"),
    page: zod_1.z.coerce.number().optional().default(1),
    limit: zod_1.z.coerce.number().optional().default(10),
});
/**
 * Response schemas
 */
exports.filmResponseSchema = zod_1.z.object({
    film: exports.filmSchema,
});
exports.filmsResponseSchema = zod_1.z.object({
    films: zod_1.z.array(exports.filmSchema),
    total: zod_1.z.number(),
});
