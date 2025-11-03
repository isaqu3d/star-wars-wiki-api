import { describe, it, expect, beforeEach, vi } from "vitest";
import { FilmRepository } from "../films.repository";
import { db } from "../../../../config/database";
import {
  createStarWarsFilm,
  createFakeFilms,
} from "../../../../__tests__/factories/film.factory";

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

describe("FilmRepository", () => {
  let filmRepository: FilmRepository;

  beforeEach(() => {
    filmRepository = new FilmRepository();
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return a film when found", async () => {
      const mockFilm = createStarWarsFilm({
        id: 1,
        title: "A New Hope",
      });

      // Mock the database response
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockFilm]),
        }),
      } as any);

      const result = await filmRepository.findById(1);

      expect(result).toEqual(mockFilm);
      expect(result?.title).toBe("A New Hope");
    });

    it("should return null when film not found", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await filmRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return films with pagination", async () => {
      const mockFilms = createFakeFilms(2);

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockFilms),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(2);

      const result = await filmRepository.findAll({ limit: 10, offset: 0 });

      expect(result.data).toEqual(mockFilms);
      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);
    });

    it("should filter films by search term", async () => {
      const empireFilm = createStarWarsFilm({
        title: "The Empire Strikes Back",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([empireFilm]),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(1);

      const result = await filmRepository.findAll({ search: "Empire" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toContain("Empire");
    });
  });
});
