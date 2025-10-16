import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CharacterController } from "../controllers/characters.controller";
import {
  characterQueryParamsSchema,
  characterIdParamSchema,
  createCharacterBodySchema,
  charactersResponseSchema,
  characterResponseSchema
} from "../schemas/characters.schema";

export const characterRoutes: FastifyPluginAsyncZod = async (server) => {
  const characterController = new CharacterController();

  // GET / - List all characters with pagination and search
  server.get("/", {
    schema: {
      tags: ["Characters"],
      summary: "Get all characters",
      querystring: characterQueryParamsSchema,
      response: {
        200: charactersResponseSchema,
      }
    }
  }, characterController.getCharacters.bind(characterController));

  // GET /:id - Get character by ID
  server.get("/:id", {
    schema: {
      tags: ["Characters"],
      summary: "Get character by ID",
      params: characterIdParamSchema,
      response: {
        200: characterResponseSchema,
      }
    }
  }, characterController.getCharacterById.bind(characterController));

  // POST / - Create new character
  server.post("/", {
    schema: {
      tags: ["Characters"],
      summary: "Create new character",
      body: createCharacterBodySchema,
      response: {
        201: characterResponseSchema,
      }
    }
  }, characterController.createCharacter.bind(characterController));

  // PUT /:id - Update character
  server.put("/:id", {
    schema: {
      tags: ["Characters"],
      summary: "Update character by ID",
      params: characterIdParamSchema,
      body: createCharacterBodySchema,
      response: {
        200: characterResponseSchema,
      }
    }
  }, characterController.updateCharacter.bind(characterController));

  // DELETE /:id - Delete character
  server.delete("/:id", {
    schema: {
      tags: ["Characters"],
      summary: "Delete character by ID",
      params: characterIdParamSchema,
    }
  }, characterController.deleteCharacter.bind(characterController));
};