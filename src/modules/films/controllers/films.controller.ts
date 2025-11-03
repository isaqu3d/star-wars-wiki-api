import { FastifyReply, FastifyRequest } from "fastify";
import {
  createFilmBodySchema,
  filmIdParamSchema,
  filmQueryParamsSchema,
} from "../schemas/films.schema";
import { FilmService } from "../services/films.service";
import { NotFoundError } from "../../../shared/errors/AppError";

export class FilmController {
  private filmService: FilmService;

  constructor() {
    this.filmService = new FilmService();
  }

  async getFilms(request: FastifyRequest, reply: FastifyReply) {
    const query = filmQueryParamsSchema.parse(request.query);
    const result = await this.filmService.getFilms(query);

    return reply.send(result);
  }

  async getFilmById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = filmIdParamSchema.parse(request.params);
    const film = await this.filmService.getFilmById(id);

    if (!film) {
      throw new NotFoundError("Film", id);
    }

    return reply.send({ film });
  }

  async createFilm(request: FastifyRequest, reply: FastifyReply) {
    const data = createFilmBodySchema.parse(request.body);
    const film = await this.filmService.createFilm(data);

    return reply.status(201).send({ film });
  }

  async updateFilm(request: FastifyRequest, reply: FastifyReply) {
    const { id } = filmIdParamSchema.parse(request.params);
    const data = createFilmBodySchema.parse(request.body);
    const film = await this.filmService.updateFilm(id, data);

    if (!film) {
      throw new NotFoundError("Film", id);
    }

    return reply.send({ film });
  }

  async deleteFilm(request: FastifyRequest, reply: FastifyReply) {
    const { id } = filmIdParamSchema.parse(request.params);
    const success = await this.filmService.deleteFilm(id);

    if (!success) {
      throw new NotFoundError("Film", id);
    }

    return reply.status(204).send();
  }
}
