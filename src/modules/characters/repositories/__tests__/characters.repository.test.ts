import { describe, it, expect, beforeEach, vi } from "vitest";
import { CharacterRepository } from "../characters.repository";
import { db } from "../../../../config/database";
import {
  createStarWarsCharacter,
  createFakeCharacters,
  createFakeCharacterData,
} from "../../../../__tests__/factories/character.factory";

// Mock the database
vi.mock("../../../../config/database", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    $count: vi.fn(),
  },
}));

describe("CharacterRepository", () => {
  let characterRepository: CharacterRepository;

  beforeEach(() => {
    characterRepository = new CharacterRepository();
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return a character when found", async () => {
      const mockCharacter = createStarWarsCharacter({
        id: 1,
        name: "Luke Skywalker",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockCharacter]),
        }),
      } as any);

      const result = await characterRepository.findById(1);

      expect(result).toEqual(mockCharacter);
      expect(result?.name).toBe("Luke Skywalker");
    });

    it("should return null when character not found", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await characterRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return characters with pagination", async () => {
      const mockCharacters = createFakeCharacters(3);

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockCharacters),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(3);

      const result = await characterRepository.findAll({ limit: 10, offset: 0 });

      expect(result.data).toEqual(mockCharacters);
      expect(result.total).toBe(3);
      expect(result.data).toHaveLength(3);
    });

    it("should filter characters by search term", async () => {
      const lukeCharacter = createStarWarsCharacter({
        name: "Luke Skywalker",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([lukeCharacter]),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(1);

      const result = await characterRepository.findAll({ search: "Luke" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain("Luke");
    });
  });

  describe("create", () => {
    it("should create a new character", async () => {
      const newCharacterData = createFakeCharacterData({
        name: "Test Character",
        image_url: "https://example.com/character.jpg", // Garantir que não seja null
      });
      const createdCharacter = { id: 1, ...newCharacterData };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdCharacter]),
        }),
      } as any);

      const result = await characterRepository.create(newCharacterData);

      expect(result).toEqual(createdCharacter);
      expect(result.name).toBe("Test Character");
    });
  });

  describe("update", () => {
    it("should update an existing character", async () => {
      const updatedCharacter = createStarWarsCharacter({
        id: 1,
        name: "Updated Name",
      });

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedCharacter]),
          }),
        }),
      } as any);

      const result = await characterRepository.update(1, { name: "Updated Name" });

      expect(result).toEqual(updatedCharacter);
      expect(result?.name).toBe("Updated Name");
    });

    it("should return null when updating non-existent character", async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await characterRepository.update(999, { name: "Test" });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing character", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      } as any);

      const result = await characterRepository.delete(1);

      expect(result).toBe(true);
    });

    it("should return false when deleting non-existent character", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await characterRepository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe("exists", () => {
    it("should return true when character exists", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      } as any);

      const result = await characterRepository.exists(1);

      expect(result).toBe(true);
    });

    it("should return false when character does not exist", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await characterRepository.exists(999);

      expect(result).toBe(false);
    });
  });
});
