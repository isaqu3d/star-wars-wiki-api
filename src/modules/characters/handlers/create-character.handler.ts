import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  characterSchema,
  createCharacterBodySchema,
} from "../schemas/character.schemas";
import { createCharacter } from "../services/character.services";

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
