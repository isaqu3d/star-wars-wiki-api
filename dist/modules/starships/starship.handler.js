"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStarshipByIdHandler = exports.getStarshipsHandler = void 0;
const zod_1 = require("zod");
const starship_schema_1 = require("./starship.schema");
const starship_service_1 = require("./starship.service");
const getStarshipsHandler = async (server) => {
    server.get("/starships", {
        schema: {
            tags: ["Starships"],
            summary: "Get all starships",
            querystring: starship_schema_1.starshipQueryParamsSchema,
            response: {
                200: starship_schema_1.starshipsResponseSchema,
            },
        },
    }, async (request) => {
        return (0, starship_service_1.getStarships)(request.query);
    });
};
exports.getStarshipsHandler = getStarshipsHandler;
const getStarshipByIdHandler = async (server) => {
    server.get("/starships/:id", {
        schema: {
            tags: ["Starships"],
            summary: "Get a starship by ID",
            params: starship_schema_1.starshipIdParamSchema,
            response: {
                200: starship_schema_1.starshipResponseSchema,
                400: zod_1.z.object({ error: zod_1.z.string() }).describe("Invalid request"),
                404: zod_1.z.object({ message: zod_1.z.string() }).describe("Starship not found"),
            },
        },
    }, async (request, reply) => {
        const starship = await (0, starship_service_1.getStarshipById)(request.params.id);
        if (!starship) {
            return reply.status(404).send({ message: "Starship not found" });
        }
        return { starship };
    });
};
exports.getStarshipByIdHandler = getStarshipByIdHandler;
