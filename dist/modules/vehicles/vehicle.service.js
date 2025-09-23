"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicles = getVehicles;
exports.getVehicleById = getVehicleById;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../../config/database");
const schema_1 = require("../../database/schema");
async function getVehicles(query) {
    const { search, page, orderBy, limit } = query;
    const conditions = search ? [(0, drizzle_orm_1.ilike)(schema_1.vehicles.name, `%${search}%`)] : [];
    const [result, total] = await Promise.all([
        database_1.db
            .select()
            .from(schema_1.vehicles)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.vehicles[orderBy]))
            .limit(limit)
            .offset((page - 1) * limit),
        database_1.db.$count(schema_1.vehicles, (0, drizzle_orm_1.and)(...conditions)),
    ]);
    return { vehicles: result, total };
}
async function getVehicleById(vehicleId) {
    const result = await database_1.db
        .select()
        .from(schema_1.vehicles)
        .where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, vehicleId));
    return result[0] ?? null;
}
