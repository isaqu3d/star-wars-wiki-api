"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanetByIdHandler = exports.getPlanetsHandler = void 0;
const zod_1 = require("zod");
const planet_schema_1 = require("./planet.schema");
const planet_service_1 = require("./planet.service");
const getPlanetsHandler = async (server) => {
    server.get("/planets", {
        schema: {
            tags: ["Planets"],
            summary: "Get all planets",
            querystring: planet_schema_1.planetQueryParamsSchema,
            response: {
                200: planet_schema_1.planetsResponseSchema,
            },
        },
    }, async (request) => {
        return (0, planet_service_1.getPlanets)(request.query);
    });
};
exports.getPlanetsHandler = getPlanetsHandler;
const getPlanetByIdHandler = async (server) => {
    server.get("/planets/:id", {
        schema: {
            tags: ["Planets"],
            summary: "Get a planet by ID",
            params: planet_schema_1.planetIdParamSchema,
            response: {
                200: planet_schema_1.planetResponseSchema,
                400: zod_1.z.object({ error: zod_1.z.string() }).describe("Invalid request"),
                404: zod_1.z.object({ message: zod_1.z.string() }).describe("Planet not found"),
            },
        },
    }, async (request, reply) => {
        const planet = await (0, planet_service_1.getPlanetById)(request.params.id);
        if (!planet) {
            return reply.status(404).send({ message: "Planet not found" });
        }
        return { planet };
    });
};
exports.getPlanetByIdHandler = getPlanetByIdHandler;
