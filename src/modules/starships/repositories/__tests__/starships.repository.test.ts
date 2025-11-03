import { describe, it, expect, beforeEach, vi } from "vitest";
import { StarshipRepository } from "../starships.repository";
import { db } from "../../../../config/database";
import {
  createStarWarsStarship,
  createFakeStarships,
  createFakeStarshipData,
} from "../../../../__tests__/factories/starship.factory";

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

describe("StarshipRepository", () => {
  let starshipRepository: StarshipRepository;

  beforeEach(() => {
    starshipRepository = new StarshipRepository();
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return a starship when found", async () => {
      const mockStarship = createStarWarsStarship({
        id: 1,
        name: "Millennium Falcon",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockStarship]),
        }),
      } as any);

      const result = await starshipRepository.findById(1);

      expect(result).toEqual(mockStarship);
      expect(result?.name).toBe("Millennium Falcon");
    });

    it("should return null when starship not found", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await starshipRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return starships with pagination", async () => {
      const mockStarships = createFakeStarships(3);

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockStarships),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(3);

      const result = await starshipRepository.findAll({ limit: 10, offset: 0 });

      expect(result.data).toEqual(mockStarships);
      expect(result.total).toBe(3);
      expect(result.data).toHaveLength(3);
    });

    it("should filter starships by search term", async () => {
      const millenniumFalcon = createStarWarsStarship({
        name: "Millennium Falcon",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([millenniumFalcon]),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(1);

      const result = await starshipRepository.findAll({ search: "Millennium" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain("Millennium");
    });
  });

  describe("create", () => {
    it("should create a new starship", async () => {
      const newStarshipData = createFakeStarshipData({
        name: "Test Starship",
      });
      const createdStarship = { id: 1, ...newStarshipData };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdStarship]),
        }),
      } as any);

      const result = await starshipRepository.create(newStarshipData);

      expect(result).toEqual(createdStarship);
      expect(result.name).toBe("Test Starship");
    });
  });

  describe("update", () => {
    it("should update an existing starship", async () => {
      const updatedStarship = createStarWarsStarship({
        id: 1,
        name: "Updated Starship",
      });

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedStarship]),
          }),
        }),
      } as any);

      const result = await starshipRepository.update(1, { name: "Updated Starship" });

      expect(result).toEqual(updatedStarship);
      expect(result?.name).toBe("Updated Starship");
    });

    it("should return null when updating non-existent starship", async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await starshipRepository.update(999, { name: "Test" });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing starship", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      } as any);

      const result = await starshipRepository.delete(1);

      expect(result).toBe(true);
    });

    it("should return false when deleting non-existent starship", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await starshipRepository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe("exists", () => {
    it("should return true when starship exists", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      } as any);

      const result = await starshipRepository.exists(1);

      expect(result).toBe(true);
    });

    it("should return false when starship does not exist", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await starshipRepository.exists(999);

      expect(result).toBe(false);
    });
  });
});
