"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const static_1 = __importDefault(require("@fastify/static"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const node_path_1 = __importDefault(require("node:path"));
const swagger_1 = require("./config/swagger");
const character_routes_1 = require("./modules/characters/character.routes");
const film_routes_1 = require("./modules/films/film.routes");
const planet_routes_1 = require("./modules/planets/planet.routes");
const starship_routes_1 = require("./modules/starships/starship.routes");
const vehicle_routes_1 = require("./modules/vehicles/vehicle.routes");
const server = (0, fastify_1.default)({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    },
}).withTypeProvider();
exports.server = server;
server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
// Register Swagger
server.register(swagger_1.registerSwagger);
// Register static files
server.register(static_1.default, {
    root: node_path_1.default.join(__dirname, "../public"),
    prefix: "/public/",
});
// Register routes
server.register(character_routes_1.characterRoutes);
server.register(planet_routes_1.planetRoutes);
server.register(film_routes_1.filmRoutes);
server.register(starship_routes_1.starshipRoutes);
server.register(vehicle_routes_1.vehicleRoutes);
