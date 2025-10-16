import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PlanetController } from "../controllers/planets.controller";
import {
  createPlanetBodySchema,
  planetIdParamSchema,
  planetQueryParamsSchema,
  planetResponseSchema,
  planetsResponseSchema,
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
          200: planetsResponseSchema,
        },
      },
    },
    planetController.getPlanets.bind(planetController)
  );

  server.get(
    "/:id",
    {
      schema: {
        tags: ["Planets"],
        summary: "Get planet by ID",
        params: planetIdParamSchema,
        response: {
          200: planetResponseSchema,
        },
      },
    },
    planetController.getPlanetById.bind(planetController)
  );

  server.post(
    "/",
    {
      schema: {
        tags: ["Planets"],
        summary: "Create a new planet",
        body: createPlanetBodySchema,
      },
    },
    planetController.createPlanet.bind(planetController)
  );

  server.put(
    "/:id",
    {
      schema: {
        tags: ["Planets"],
        summary: "Update planet by ID",
        params: planetIdParamSchema,
        body: createPlanetBodySchema,
        response: {
          200: planetResponseSchema,
        },
      },
    },
    planetController.updatePlanet.bind(planetController)
  );

  server.delete(
    "/:id",
    {
      schema: {
        tags: ["Planets"],
        summary: "Delete planet by ID",
        params: planetIdParamSchema,
      },
    },
    planetController.deletePlanet.bind(planetController)
  );
};
