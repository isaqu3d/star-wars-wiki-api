import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  characterSchema,
  createCharacterBodySchema,
} from "../character.schemas";
import { createCharacter } from "../character.services";

export const createCharacterHandler: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/character",
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
