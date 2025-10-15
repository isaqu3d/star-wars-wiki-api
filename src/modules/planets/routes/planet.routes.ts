import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PlanetController } from "../controllers/planets.controller";
import {
  planetQueryParamsSchema,
  planetResponseSchema,
} from "../schemas/planets.schema";

export const planetRoutes: FastifyPluginAsyncZod = async (server) => {
  const planetController = new PlanetController();

  server.get(
    "/",
    {
      schema: {
        tags: ["Planets"],
        summary: "Get all planets",
        querystring: planetQueryParamsSchema,
        response: {
          200: planetResponseSchema,
        },
      },
    },
    planetController.getPlanets.bind(planetController)
  );
};
