import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { server } from "../../../app";
import request from "supertest";

describe("Films API Integration Tests", () => {
  beforeAll(async () => {
    // Start the server
    await server.ready();
  });

  afterAll(async () => {
    // Close the server
    await server.close();
  });

  describe("GET /films", () => {
    it("should return a list of films with pagination", async () => {
      const response = await request(server.server)
        .get("/films")
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toHaveProperty("films");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.films)).toBe(true);
      expect(typeof response.body.total).toBe("number");
    });

    it("should filter films by search query", async () => {
      const response = await request(server.server)
        .get("/films")
        .query({ search: "Hope" })
        .expect(200);

      expect(response.body.films).toBeDefined();

      // If there are results, verify they match the search
      if (response.body.films.length > 0) {
        expect(
          response.body.films.some((film: any) =>
            film.title.toLowerCase().includes("hope")
          )
        ).toBe(true);
      }
    });

    it("should handle invalid query parameters gracefully", async () => {
      const response = await request(server.server)
        .get("/films")
        .query({ page: "invalid" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("Validation error");
    });
  });

  describe("GET /films/:id", () => {
    it("should return a single film by ID", async () => {
      // First create a film
      const createResponse = await request(server.server)
        .post("/films")
        .send({
          title: "Test Film",
          episode_id: 1,
          opening_crawl: "Test crawl",
          director: "Test Director",
          producer: "Test Producer",
          release_date: "2024-01-01",
        })
        .expect(201);

      const createdFilmId = createResponse.body.film.id;

      // Then fetch it
      const response = await request(server.server)
        .get(`/films/${createdFilmId}`)
        .expect(200);

      expect(response.body).toHaveProperty("film");
      expect(response.body.film).toHaveProperty("id");
      expect(response.body.film).toHaveProperty("title");
      expect(response.body.film.id).toBe(createdFilmId);
      expect(response.body.film.title).toBe("Test Film");
    });

    it("should return 404 for non-existent film", async () => {
      const response = await request(server.server)
        .get("/films/99999")
        .expect(404);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("not found");
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(server.server)
        .get("/films/invalid-id")
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /films", () => {
    it("should create a new film", async () => {
      const newFilm = {
        title: "Test Film",
        episode_id: 10,
        opening_crawl: "This is a test film",
        director: "Test Director",
        producer: "Test Producer",
        release_date: "2024-01-01",
      };

      const response = await request(server.server)
        .post("/films")
        .send(newFilm)
        .expect(201);

      expect(response.body).toHaveProperty("film");
      expect(response.body.film).toHaveProperty("id");
      expect(response.body.film.title).toBe(newFilm.title);
      expect(response.body.film.episode_id).toBe(newFilm.episode_id);
    });

    it("should return 400 for invalid film data", async () => {
      const invalidFilm = {
        // Missing required fields
        episode_id: "invalid", // Should be number
      };

      const response = await request(server.server)
        .post("/films")
        .send(invalidFilm)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /films/:id", () => {
    it("should update an existing film", async () => {
      const updateData = {
        title: "Updated Film Title",
        episode_id: 4,
        opening_crawl: "Updated opening crawl",
        director: "Updated Director",
        producer: "Updated Producer",
        release_date: "1977-05-25",
      };

      const response = await request(server.server)
        .put("/films/1")
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("film");
      expect(response.body.film.title).toBe(updateData.title);
    });

    it("should return 404 when updating non-existent film", async () => {
      const updateData = {
        title: "Non-existent Film",
        episode_id: 99,
        opening_crawl: "Test",
        director: "Test",
        producer: "Test",
        release_date: "2024-01-01",
      };

      const response = await request(server.server)
        .put("/films/99999")
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /films/:id", () => {
    it("should delete an existing film", async () => {
      // First create a film to delete
      const newFilm = {
        title: "Film to Delete",
        episode_id: 99,
        opening_crawl: "Test",
        director: "Test",
        producer: "Test",
        release_date: "2024-01-01",
      };

      const createResponse = await request(server.server)
        .post("/films")
        .send(newFilm);

      const filmId = createResponse.body.film.id;

      // Now delete it
      await request(server.server).delete(`/films/${filmId}`).expect(204);

      // Verify it's deleted
      await request(server.server).get(`/films/${filmId}`).expect(404);
    });

    it("should return 404 when deleting non-existent film", async () => {
      const response = await request(server.server)
        .delete("/films/99999")
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Not Found Routes", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(server.server)
        .get("/films/nonexistent/route")
        .expect(404);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("not found");
    });
  });
});
