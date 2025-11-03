import { describe, it, expect, beforeEach, vi } from "vitest";
import { PlanetRepository } from "../planets.repository";
import { db } from "../../../../config/database";
import {
  createStarWarsPlanet,
  createFakePlanets,
  createFakePlanetData,
} from "../../../../__tests__/factories/planet.factory";

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

describe("PlanetRepository", () => {
  let planetRepository: PlanetRepository;

  beforeEach(() => {
    planetRepository = new PlanetRepository();
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return a planet when found", async () => {
      const mockPlanet = createStarWarsPlanet({
        id: 1,
        name: "Tatooine",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockPlanet]),
        }),
      } as any);

      const result = await planetRepository.findById(1);

      expect(result).toEqual(mockPlanet);
      expect(result?.name).toBe("Tatooine");
    });

    it("should return null when planet not found", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await planetRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return planets with pagination", async () => {
      const mockPlanets = createFakePlanets(3);

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockPlanets),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(3);

      const result = await planetRepository.findAll({ limit: 10, offset: 0 });

      expect(result.data).toEqual(mockPlanets);
      expect(result.total).toBe(3);
      expect(result.data).toHaveLength(3);
    });

    it("should filter planets by search term", async () => {
      const tatoooinePlanet = createStarWarsPlanet({
        name: "Tatooine",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([tatoooinePlanet]),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(1);

      const result = await planetRepository.findAll({ search: "Tatooine" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain("Tatooine");
    });
  });

  describe("create", () => {
    it("should create a new planet", async () => {
      const newPlanetData = createFakePlanetData({
        name: "Test Planet",
      });
      const createdPlanet = { id: 1, ...newPlanetData };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdPlanet]),
        }),
      } as any);

      const result = await planetRepository.create(newPlanetData);

      expect(result).toEqual(createdPlanet);
      expect(result.name).toBe("Test Planet");
    });
  });

  describe("update", () => {
    it("should update an existing planet", async () => {
      const updatedPlanet = createStarWarsPlanet({
        id: 1,
        name: "Updated Name",
      });

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedPlanet]),
          }),
        }),
      } as any);

      const result = await planetRepository.update(1, { name: "Updated Name" });

      expect(result).toEqual(updatedPlanet);
      expect(result?.name).toBe("Updated Name");
    });

    it("should return null when updating non-existent planet", async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await planetRepository.update(999, { name: "Test" });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing planet", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      } as any);

      const result = await planetRepository.delete(1);

      expect(result).toBe(true);
    });

    it("should return false when deleting non-existent planet", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await planetRepository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe("exists", () => {
    it("should return true when planet exists", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      } as any);

      const result = await planetRepository.exists(1);

      expect(result).toBe(true);
    });

    it("should return false when planet does not exist", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await planetRepository.exists(999);

      expect(result).toBe(false);
    });
  });
});
