import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { FilmController } from "../controllers/films.controller";
import {
  createFilmBodySchema,
  filmIdParamSchema,
  filmQueryParamsSchema,
  filmResponseSchema,
  filmsResponseSchema,
} from "../schemas/films.schema";

export const filmRoutes: FastifyPluginAsyncZod = async (server) => {
  const filmController = new FilmController();

  server.get(
    "/",
    {
      schema: {
        tags: ["Films"],
        summary: "Get all films",
        querystring: filmQueryParamsSchema,
        response: {
          200: filmsResponseSchema,
        },
      },
    },
    filmController.getFilms.bind(filmController)
  );

  server.get(
    "/:id",
    {
      schema: {
        tags: ["Films"],
        summary: "Get film by ID",
        params: filmIdParamSchema,
        response: {
          200: filmResponseSchema,
        },
      },
    },
    filmController.getFilmById.bind(filmController)
  );

  server.post(
    "/",
    {
      schema: {
        tags: ["Films"],
        summary: "Create a new film",
        body: createFilmBodySchema,
      },
    },
    filmController.createFilm.bind(filmController)
  );

  server.put(
    "/:id",
    {
      schema: {
        tags: ["Films"],
        summary: "Update a film by ID",
        params: filmIdParamSchema,
        body: createFilmBodySchema,
        response: {
          200: filmResponseSchema,
        },
      },
    },
    filmController.updateFilm.bind(filmController)
  );

  server.delete(
    "/:id",
    {
      schema: {
        tags: ["Films"],
        summary: "Delete a film by ID",
        params: filmIdParamSchema,
      },
    },
    filmController.deleteFilm.bind(filmController)
  );
};
