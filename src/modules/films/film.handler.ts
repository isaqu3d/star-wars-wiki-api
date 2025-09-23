import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  filmIdParamSchema,
  filmQueryParamsSchema,
  filmResponseSchema,
  filmsResponseSchema,
} from "./film.schema";
import { getFilms, getFilmById } from "./film.service";

export const getFilmsHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/films",
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
    async (request) => {
      return getFilms(request.query);
    }
  );
};

export const getFilmByIdHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/films/:id",
    {
      schema: {
        tags: ["Films"],
        summary: "Get a film by ID",
        params: filmIdParamSchema,
        response: {
          200: filmResponseSchema,
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z.object({ message: z.string() }).describe("Film not found"),
        },
      },
    },
    async (request, reply) => {
      const film = await getFilmById(request.params.id);

      if (!film) {
        return reply.status(404).send({ message: "Film not found" });
      }

      return { film };
    }
  );
};