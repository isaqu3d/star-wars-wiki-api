import { FastifyReply, FastifyRequest } from "fastify";
import {
  characterIdParamSchema,
  characterQueryParamsSchema,
  createCharacterBodySchema,
} from "../schemas/characters.schema";
import { CharacterService } from "../services/characters.service";
import { NotFoundError } from "../../../shared/errors/AppError";

export class CharacterController {
  private characterService: CharacterService;

  constructor() {
    this.characterService = new CharacterService();
  }

  /**
   * Get all characters with pagination and search
   */
  async getCharacters(request: FastifyRequest, reply: FastifyReply) {
    const query = characterQueryParamsSchema.parse(request.query);
    const result = await this.characterService.getCharacters(query);
    return reply.send(result);
  }

  /**
   * Get character by ID
   */
  async getCharacterById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = characterIdParamSchema.parse(request.params);
    const character = await this.characterService.getCharacterById(id);

    if (!character) {
      throw new NotFoundError("Character", id);
    }

    return reply.send({ character });
  }

  /**
   * Create a new character
   */
  async createCharacter(request: FastifyRequest, reply: FastifyReply) {
    const data = createCharacterBodySchema.parse(request.body);
    const character = await this.characterService.createCharacter(data);
    return reply.status(201).send({ character });
  }

  /**
   * Update character by ID
   */
  async updateCharacter(request: FastifyRequest, reply: FastifyReply) {
    const { id } = characterIdParamSchema.parse(request.params);
    const data = createCharacterBodySchema.parse(request.body);
    const character = await this.characterService.updateCharacter(id, data);

    if (!character) {
      throw new NotFoundError("Character", id);
    }

    return reply.send({ character });
  }

  /**
   * Delete character by ID
   */
  async deleteCharacter(request: FastifyRequest, reply: FastifyReply) {
    const { id } = characterIdParamSchema.parse(request.params);
    const success = await this.characterService.deleteCharacter(id);

    if (!success) {
      throw new NotFoundError("Character", id);
    }

    return reply.status(204).send();
  }
}
