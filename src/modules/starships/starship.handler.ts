import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  starshipIdParamSchema,
  starshipQueryParamsSchema,
  starshipResponseSchema,
  starshipsResponseSchema,
} from "./starship.schema";
import { getStarships, getStarshipById } from "./starship.service";

export const getStarshipsHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/starships",
    {
      schema: {
        tags: ["Starships"],
        summary: "Get all starships",
        querystring: starshipQueryParamsSchema,
        response: {
          200: starshipsResponseSchema,
        },
      },
    },
    async (request) => {
      return getStarships(request.query);
    }
  );
};

export const getStarshipByIdHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/starships/:id",
    {
      schema: {
        tags: ["Starships"],
        summary: "Get a starship by ID",
        params: starshipIdParamSchema,
        response: {
          200: starshipResponseSchema,
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z.object({ message: z.string() }).describe("Starship not found"),
        },
      },
    },
    async (request, reply) => {
      const starship = await getStarshipById(request.params.id);

      if (!starship) {
        return reply.status(404).send({ message: "Starship not found" });
      }

      return { starship };
    }
  );
};