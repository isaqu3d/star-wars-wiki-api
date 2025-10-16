import { CharacterRepository } from "../repositories/characters.repository";
import {
  Character,
  CharacterFilters,
  CharacterQueryParams,
  CharactersResponse,
  CreateCharacterData,
} from "../types/characters.types";

export class CharacterService {
  private characterRepository: CharacterRepository;

  constructor() {
    this.characterRepository = new CharacterRepository();
  }

  /**
   * Get all characters with pagination and search
   */
  async getCharacters(
    query: CharacterQueryParams
  ): Promise<CharactersResponse> {
    const { search, limit, orderBy, page } = query;

    const filters: CharacterFilters = {
      search,
      limit,
      offset: (page - 1) * limit,
      orderBy,
    };

    const { data: characters, total } =
      await this.characterRepository.findAll(filters);

    return { characters, total };
  }

  /**
   * Get character by ID
   */
  async getCharacterById(id: number): Promise<Character | null> {
    return await this.characterRepository.findById(id);
  }

  /**
   * Search characters by name
   */
  async searchCharactersByName(name: string): Promise<Character[]> {
    return await this.characterRepository.findByName(name);
  }

  /**
   * Create a new character
   */
  async createCharacter(data: CreateCharacterData): Promise<Character> {
    return await this.characterRepository.create(data);
  }

  /**
   * Update character by ID
   */
  async updateCharacter(
    id: number,
    data: CreateCharacterData
  ): Promise<Character | null> {
    // Check if character exists first
    const exists = await this.characterRepository.exists(id);
    if (!exists) {
      return null;
    }

    return await this.characterRepository.update(id, data);
  }

  /**
   * Delete character by ID
   */
  async deleteCharacter(id: number): Promise<boolean> {
    return await this.characterRepository.delete(id);
  }
}
