"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilms = getFilms;
exports.getFilmById = getFilmById;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../../config/database");
const schema_1 = require("../../database/schema");
async function getFilms(query) {
    const { search, page, orderBy, limit } = query;
    const conditions = search ? [(0, drizzle_orm_1.ilike)(schema_1.films.title, `%${search}%`)] : [];
    const [result, total] = await Promise.all([
        database_1.db
            .select()
            .from(schema_1.films)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.films[orderBy]))
            .limit(limit)
            .offset((page - 1) * limit),
        database_1.db.$count(schema_1.films, (0, drizzle_orm_1.and)(...conditions)),
    ]);
    return { films: result, total };
}
async function getFilmById(filmId) {
    const result = await database_1.db
        .select()
        .from(schema_1.films)
        .where((0, drizzle_orm_1.eq)(schema_1.films.id, filmId));
    return result[0] ?? null;
}
