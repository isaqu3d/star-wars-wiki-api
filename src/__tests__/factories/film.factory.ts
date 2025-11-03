import { faker } from "@faker-js/faker";
import type { Film } from "../../modules/films/types/films.types";

/**
 * Generate a fake film for testing
 */
export const createFakeFilm = (overrides?: Partial<Film>): Film => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    title: faker.lorem.words(3),
    episode_id: faker.number.int({ min: 1, max: 20 }),
    opening_crawl: faker.lorem.paragraphs(3),
    director: faker.person.fullName(),
    producer: faker.person.fullName(),
    release_date: faker.date.past({ years: 50 }).toISOString().split("T")[0],
    ...overrides,
  };
};

/**
 * Generate multiple fake films
 */
export const createFakeFilms = (count: number = 5): Film[] => {
  return Array.from({ length: count }, () => createFakeFilm());
};

/**
 * Create a film without ID (for creation tests)
 */
export const createFakeFilmData = (
  overrides?: Partial<Omit<Film, "id">>
): Omit<Film, "id"> => {
  const film = createFakeFilm();
  const { id, ...filmData } = film;
  return { ...filmData, ...overrides };
};

/**
 * Star Wars themed film generator
 */
export const createStarWarsFilm = (overrides?: Partial<Film>): Film => {
  const titles = [
    "A New Hope",
    "The Empire Strikes Back",
    "Return of the Jedi",
    "The Phantom Menace",
    "Attack of the Clones",
    "Revenge of the Sith",
    "The Force Awakens",
    "The Last Jedi",
    "The Rise of Skywalker",
  ];

  const directors = [
    "George Lucas",
    "Irvin Kershner",
    "Richard Marquand",
    "J. J. Abrams",
    "Rian Johnson",
  ];

  const producers = ["Gary Kurtz", "Rick McCallum", "Kathleen Kennedy"];

  return {
    id: faker.number.int({ min: 1, max: 100 }),
    title: faker.helpers.arrayElement(titles),
    episode_id: faker.number.int({ min: 1, max: 9 }),
    opening_crawl: `It is a period of ${faker.lorem.words(3)}...`,
    director: faker.helpers.arrayElement(directors),
    producer: faker.helpers.arrayElement(producers),
    release_date: faker.date
      .between({ from: "1977-01-01", to: "2023-12-31" })
      .toISOString()
      .split("T")[0],
    ...overrides,
  };
};
