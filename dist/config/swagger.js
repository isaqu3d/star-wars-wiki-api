"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSwagger = void 0;
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const registerSwagger = async (server) => {
    if (process.env.NODE_ENV === "development") {
        // Registers OpenAPI spec generator
        await server.register(swagger_1.default, {
            openapi: {
                info: {
                    title: "Star Wars API",
                    description: "API for Star Wars characters, planets, vehicles, starships, and films",
                    version: "1.0.0",
                },
            },
            transform: fastify_type_provider_zod_1.jsonSchemaTransform,
        });
        // Registers Swagger UI
        await server.register(swagger_ui_1.default, {
            routePrefix: "/docs",
            uiConfig: {
                docExpansion: "list",
                deepLinking: false,
            },
            staticCSP: true,
            transformSpecification: (swaggerObject) => swaggerObject,
        });
        console.log("Swagger docs available at: http://localhost:3333/docs");
    }
};
exports.registerSwagger = registerSwagger;
