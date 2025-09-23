"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanets = getPlanets;
exports.getPlanetById = getPlanetById;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../../config/database");
const schema_1 = require("../../database/schema");
async function getPlanets(query) {
    const { search, page, orderBy, limit } = query;
    const conditions = search ? [(0, drizzle_orm_1.ilike)(schema_1.planets.name, `%${search}%`)] : [];
    const [result, total] = await Promise.all([
        database_1.db
            .select()
            .from(schema_1.planets)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.planets[orderBy]))
            .limit(limit)
            .offset((page - 1) * limit),
        database_1.db.$count(schema_1.planets, (0, drizzle_orm_1.and)(...conditions)),
    ]);
    return { planets: result, total };
}
async function getPlanetById(planetId) {
    const result = await database_1.db
        .select()
        .from(schema_1.planets)
        .where((0, drizzle_orm_1.eq)(schema_1.planets.id, planetId));
    return result[0] ?? null;
}
