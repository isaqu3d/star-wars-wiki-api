"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharacter = createCharacter;
exports.getCharacters = getCharacters;
exports.getCharacterById = getCharacterById;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../../config/database");
const schema_1 = require("../../database/schema");
async function createCharacter(data) {
    const [newCharacter] = await database_1.db.insert(schema_1.characters).values(data).returning();
    return newCharacter;
}
async function getCharacters(query) {
    const { search, limit, orderBy, page } = query;
    const conditions = search ? [(0, drizzle_orm_1.ilike)(schema_1.characters.name, `%${search}%`)] : [];
    const [result, total] = await Promise.all([
        database_1.db
            .select()
            .from(schema_1.characters)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.characters[orderBy]))
            .limit(limit)
            .offset((page - 1) * limit),
        database_1.db.$count(schema_1.characters, (0, drizzle_orm_1.and)(...conditions)),
    ]);
    return { characters: result, total };
}
async function getCharacterById(characterId) {
    const result = await database_1.db
        .select()
        .from(schema_1.characters)
        .where((0, drizzle_orm_1.eq)(schema_1.characters.id, characterId));
    return result[0] ?? null;
}
