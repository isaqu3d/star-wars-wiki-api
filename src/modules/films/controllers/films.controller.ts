import { FastifyReply, FastifyRequest } from "fastify";
import {
  filmIdParamSchema,
  filmQueryParamsSchema,
} from "../schemas/films.schema";
import { FilmService } from "../services/films.service";

export class FilmController {
  private filmService: FilmService;

  constructor() {
    this.filmService = new FilmService();
  }

  async getFilms(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = filmQueryParamsSchema.parse(request.query);
      const result = await this.filmService.getFilms(query);

      return reply.send(result);
    } catch (error) {
      return reply.status(400).send({ error: "Invalid query parameters" });
    }
  }

  async getFilmById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = filmIdParamSchema.parse(request.params);
      const film = await this.filmService.getFilmById(id);

      if (!film) {
        return reply.status(404).send({ message: "Film not found" });
      }

      return reply.send({ film });
    } catch (error) {
      return reply.status(400).send({ error: "Invalid film data" });
    }
  }
}
