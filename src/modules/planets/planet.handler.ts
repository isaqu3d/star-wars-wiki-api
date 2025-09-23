import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  planetIdParamSchema,
  planetQueryParamsSchema,
  planetResponseSchema,
  planetsResponseSchema,
} from "./planet.schema";
import { getPlanets, getPlanetById } from "./planet.service";

export const getPlanetsHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/planets",
    {
      schema: {
        tags: ["Planets"],
        summary: "Get all planets",
        querystring: planetQueryParamsSchema,
        response: {
          200: planetsResponseSchema,
        },
      },
    },
    async (request) => {
      return getPlanets(request.query);
    }
  );
};

export const getPlanetByIdHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/planets/:id",
    {
      schema: {
        tags: ["Planets"],
        summary: "Get a planet by ID",
        params: planetIdParamSchema,
        response: {
          200: planetResponseSchema,
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z.object({ message: z.string() }).describe("Planet not found"),
        },
      },
    },
    async (request, reply) => {
      const planet = await getPlanetById(request.params.id);

      if (!planet) {
        return reply.status(404).send({ message: "Planet not found" });
      }

      return { planet };
    }
  );
};