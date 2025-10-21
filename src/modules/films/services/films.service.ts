import { FilmRepository } from "../repositories/films.repository";
import { Film, FilmQueryParams, FilmsResponse } from "../types/films.types";

export class FilmService {
  private filmRepository: FilmRepository;
  constructor() {
    this.filmRepository = new FilmRepository();
  }

  async getFilms(query: FilmQueryParams): Promise<FilmsResponse> {
    const { limit, orderBy, page, search } = query;

    const filters = {
      limit,
      search,
      offset: (page - 1) * limit,
      orderBy,
    };

    const { data: films, total } = await this.filmRepository.findAll(filters);

    return { films, total };
  }

  async getFilmById(id: number): Promise<Film | null> {
    return await this.filmRepository.findById(id);
  }
}
