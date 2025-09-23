import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const registerSwagger = async (server: FastifyInstance) => {
  if (process.env.NODE_ENV === "development") {
    // Registers OpenAPI spec generator
    await server.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Star Wars API",
          description:
            "API for Star Wars characters, planets, vehicles, starships, and films",
          version: "1.0.0",
        },
      },
      transform: jsonSchemaTransform,
    });

    // Registers Swagger UI
    await server.register(fastifySwaggerUi, {
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