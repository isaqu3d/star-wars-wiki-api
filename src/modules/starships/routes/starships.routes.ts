import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { StarshipController } from "../controllers/starships.controller";
import {
  starshipQueryParamsSchema,
  starshipIdParamSchema,
  starshipResponseSchema,
  starshipsResponseSchema,
  createStarshipBodySchema,
  updateStarshipSchema,
} from "../schemas/starships.schema";

export const starshipRoutes: FastifyPluginAsyncZod = async (server) => {
  const starshipController = new StarshipController();

  // Get all starships
  server.get(
    "/",
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
    starshipController.getStarships.bind(starshipController)
  );

  // Get starship by ID
  server.get(
    "/:id",
    {
      schema: {
        tags: ["Starships"],
        summary: "Get a starship by ID",
        params: starshipIdParamSchema,
        response: {
          200: starshipResponseSchema,
        },
      },
    },
    starshipController.getStarshipById.bind(starshipController)
  );

  // Create new starship
  server.post(
    "/",
    {
      schema: {
        tags: ["Starships"],
        summary: "Create a new starship",
        body: createStarshipBodySchema,
        response: {
          201: starshipResponseSchema,
        },
      },
    },
    starshipController.createStarship.bind(starshipController)
  );

  // Update starship
  server.put(
    "/:id",
    {
      schema: {
        tags: ["Starships"],
        summary: "Update a starship",
        params: starshipIdParamSchema,
        body: updateStarshipSchema,
        response: {
          200: starshipResponseSchema,
        },
      },
    },
    starshipController.updateStarship.bind(starshipController)
  );

  // Delete starship
  server.delete(
    "/:id",
    {
      schema: {
        tags: ["Starships"],
        summary: "Delete a starship",
        params: starshipIdParamSchema,
        response: {
          204: {},
        },
      },
    },
    starshipController.deleteStarship.bind(starshipController)
  );
};
