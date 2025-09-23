"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmByIdHandler = exports.getFilmsHandler = void 0;
const zod_1 = require("zod");
const film_schema_1 = require("./film.schema");
const film_service_1 = require("./film.service");
const getFilmsHandler = async (server) => {
    server.get("/films", {
        schema: {
            tags: ["Films"],
            summary: "Get all films",
            querystring: film_schema_1.filmQueryParamsSchema,
            response: {
                200: film_schema_1.filmsResponseSchema,
            },
        },
    }, async (request) => {
        return (0, film_service_1.getFilms)(request.query);
    });
};
exports.getFilmsHandler = getFilmsHandler;
const getFilmByIdHandler = async (server) => {
    server.get("/films/:id", {
        schema: {
            tags: ["Films"],
            summary: "Get a film by ID",
            params: film_schema_1.filmIdParamSchema,
            response: {
                200: film_schema_1.filmResponseSchema,
                400: zod_1.z.object({ error: zod_1.z.string() }).describe("Invalid request"),
                404: zod_1.z.object({ message: zod_1.z.string() }).describe("Film not found"),
            },
        },
    }, async (request, reply) => {
        const film = await (0, film_service_1.getFilmById)(request.params.id);
        if (!film) {
            return reply.status(404).send({ message: "Film not found" });
        }
        return { film };
    });
};
exports.getFilmByIdHandler = getFilmByIdHandler;
