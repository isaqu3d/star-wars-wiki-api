import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import path from "node:path";
import { GetCharactersRoute } from "./routes/characters/get-characters";
import { GetCharactersByIdRoute } from "./routes/characters/get-characters-by-id";
import { GetPlanetsRoute } from "./routes/planets/get-planets";
import { GetPlanetsByIdRoute } from "./routes/planets/get-planets-by-id";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

// Swagger only in development
if (process.env.NODE_ENV === "development") {
  // Registers OpenAPI spec generator
  server.register(fastifySwagger, {
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
  server.register(fastifySwaggerUi, {
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
server.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
  prefix: "/public/",
});
server.register(GetCharactersRoute);
server.register(GetCharactersByIdRoute);
server.register(GetPlanetsRoute);
server.register(GetPlanetsByIdRoute);

export { server };
