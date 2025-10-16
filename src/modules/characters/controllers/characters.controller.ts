import { FastifyReply, FastifyRequest } from "fastify";
import {
  characterIdParamSchema,
  characterQueryParamsSchema,
  createCharacterBodySchema,
} from "../schemas/characters.schema";
import { CharacterService } from "../services/characters.service";

export class CharacterController {
  private characterService: CharacterService;

  constructor() {
    this.characterService = new CharacterService();
  }

  /**
   * Get all characters with pagination and search
   */
  async getCharacters(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = characterQueryParamsSchema.parse(request.query);
      const result = await this.characterService.getCharacters(query);
      return reply.send(result);
    } catch (error) {
      return reply.status(400).send({ error: "Invalid query parameters" });
    }
  }

  /**
   * Get character by ID
   */
  async getCharacterById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = characterIdParamSchema.parse(request.params);
      const character = await this.characterService.getCharacterById(id);

      if (!character) {
        return reply.status(404).send({ message: "Character not found" });
      }

      return reply.send({ character });
    } catch (error) {
      return reply.status(400).send({ error: "Invalid character ID" });
    }
  }

  /**
   * Create a new character
   */
  async createCharacter(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createCharacterBodySchema.parse(request.body);
      const character = await this.characterService.createCharacter(data);
      return reply.status(201).send({ character });
    } catch (error) {
      return reply.status(400).send({ error: "Invalid character data" });
    }
  }

  /**
   * Update character by ID
   */
  async updateCharacter(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = characterIdParamSchema.parse(request.params);
      const data = createCharacterBodySchema.parse(request.body);

      const character = await this.characterService.updateCharacter(id, data);

      if (!character) {
        return reply.status(404).send({ message: "Character not found" });
      }

      return reply.send({ character });
    } catch (error) {
      return reply.status(400).send({ error: "Invalid request data" });
    }
  }

  /**
   * Delete character by ID
   */
  async deleteCharacter(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = characterIdParamSchema.parse(request.params);
      const success = await this.characterService.deleteCharacter(id);

      if (!success) {
        return reply.status(404).send({ message: "Character not found" });
      }

      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ error: "Invalid character ID" });
    }
  }
}
