import { FilmRepository } from "../repositories/films.repository";
import {
  CreateFilmData,
  Film,
  FilmQueryParams,
  FilmsResponse,
} from "../types/films.types";

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

  async createFilm(data: CreateFilmData): Promise<Film> {
    return await this.filmRepository.create(data);
  }

  async updateFilm(
    id: number,
    data: Partial<CreateFilmData>
  ): Promise<Film | null> {
    const existingFilm = await this.filmRepository.exists(id);

    if (!existingFilm) {
      return null;
    }

    return await this.filmRepository.update(id, data);
  }

  async deleteFilm(id: number): Promise<boolean> {
    return await this.filmRepository.delete(id);
  }
}
