import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  characterIdParamSchema,
  characterQueryParamsSchema,
  characterResponseSchema,
  characterSchema,
  charactersResponseSchema,
  createCharacterBodySchema,
} from "./character.schema";
import {
  createCharacter,
  deleteCharacter,
  getCharacterById,
  getCharacters,
  updateCharacter,
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

export const deleteCharacterHandler: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/characters/:id",
    {
      schema: {
        tags: ["Characters"],
        summary: "Delete a character by ID",
        params: characterIdParamSchema,
        response: {
          204: z.null().describe("Character deleted"),
          404: z
            .object({ message: z.string() })
            .describe("Character not found"),
        },
      },
    },
    async (request, reply) => {
      const success = await deleteCharacter(request.params.id);

      if (!success) {
        return reply.status(404).send({ message: "Character not found" });
      }

      return reply.status(204).send();
    }
  );
};

export const updateCharacterHandler: FastifyPluginAsyncZod = async (server) => {
  server.put(
    "/characters/:id",
    {
      schema: {
        tags: ["Characters"],
        summary: "Update a character by ID",
        params: characterIdParamSchema,
        body: createCharacterBodySchema,
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
      const character = await updateCharacter(request.params.id, request.body);

      if (!character) {
        return reply.status(404).send({ message: "Character not found" });
      }

      return { character };
    }
  );
};
