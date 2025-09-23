"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharacterHandler = exports.getCharacterByIdHandler = exports.getCharactersHandler = void 0;
const zod_1 = require("zod");
const character_schema_1 = require("./character.schema");
const character_service_1 = require("./character.service");
const getCharactersHandler = async (server) => {
    server.get("/characters", {
        schema: {
            tags: ["Characters"],
            summary: "Get all characters with pagination and search",
            querystring: character_schema_1.characterQueryParamsSchema,
            response: {
                200: character_schema_1.charactersResponseSchema,
            },
        },
    }, async (request) => {
        return (0, character_service_1.getCharacters)(request.query);
    });
};
exports.getCharactersHandler = getCharactersHandler;
const getCharacterByIdHandler = async (server) => {
    server.get("/characters/:id", {
        schema: {
            tags: ["Characters"],
            summary: "Get a character by ID",
            params: character_schema_1.characterIdParamSchema,
            response: {
                200: character_schema_1.characterResponseSchema,
                400: zod_1.z.object({ error: zod_1.z.string() }).describe("Invalid request"),
                404: zod_1.z
                    .object({ message: zod_1.z.string() })
                    .describe("Character not found"),
            },
        },
    }, async (request, reply) => {
        const character = await (0, character_service_1.getCharacterById)(request.params.id);
        if (!character) {
            return reply.status(404).send({ message: "Character not found" });
        }
        return { character };
    });
};
exports.getCharacterByIdHandler = getCharacterByIdHandler;
const createCharacterHandler = async (server) => {
    server.post("/characters", {
        schema: {
            tags: ["Characters"],
            summary: "Create character",
            body: character_schema_1.createCharacterBodySchema,
            response: { 201: character_schema_1.characterSchema },
        },
    }, async (request, reply) => {
        const character = await (0, character_service_1.createCharacter)(request.body);
        return reply.status(201).send(character);
    });
};
exports.createCharacterHandler = createCharacterHandler;
