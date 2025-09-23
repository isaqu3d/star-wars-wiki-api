"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStarships = getStarships;
exports.getStarshipById = getStarshipById;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../../config/database");
const schema_1 = require("../../database/schema");
async function getStarships(query) {
    const { search, page, orderBy, limit } = query;
    const conditions = search ? [(0, drizzle_orm_1.ilike)(schema_1.starships.name, `%${search}%`)] : [];
    const [result, total] = await Promise.all([
        database_1.db
            .select()
            .from(schema_1.starships)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.starships[orderBy]))
            .limit(limit)
            .offset((page - 1) * limit),
        database_1.db.$count(schema_1.starships, (0, drizzle_orm_1.and)(...conditions)),
    ]);
    return { starships: result, total };
}
async function getStarshipById(starshipId) {
    const result = await database_1.db
        .select()
        .from(schema_1.starships)
        .where((0, drizzle_orm_1.eq)(schema_1.starships.id, starshipId));
    return result[0] ?? null;
}
