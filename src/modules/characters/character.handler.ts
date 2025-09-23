import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  characterIdParamSchema,
  characterQueryParamsSchema,
  characterResponseSchema,
  charactersResponseSchema,
  characterSchema,
  createCharacterBodySchema,
} from "./character.schema";
import {
  getCharacters,
  getCharacterById,
  createCharacter,
} from "./character.service";

export const getCharactersHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/characters",
    {
      schema: {
        tags: ["Characters"],
        summary: "Get all characters with pagination and search",
        querystring: characterQueryParamsSchema,
        response: {
          200: charactersResponseSchema,
        },
      },
    },
    async (request) => {
      return getCharacters(request.query);
    }
  );
};

export const getCharacterByIdHandler: FastifyPluginAsyncZod = async (
  server
) => {
  server.get(
    "/characters/:id",
    {
      schema: {
        tags: ["Characters"],
        summary: "Get a character by ID",
        params: characterIdParamSchema,
        response: {
          200: characterResponseSchema,
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z
            .object({ message: z.string() })
            .describe("Character not found"),
        },
      },
    },
    async (request, reply) => {
      const character = await getCharacterById(request.params.id);

      if (!character) {
        return reply.status(404).send({ message: "Character not found" });
      }

      return { character };
    }
  );
};

export const createCharacterHandler: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/characters",
    {
      schema: {
        tags: ["Characters"],
        summary: "Create character",
        body: createCharacterBodySchema,
        response: { 201: characterSchema },
      },
    },
    async (request, reply) => {
      const character = await createCharacter(request.body);

      return reply.status(201).send(character);
    }
  );
};