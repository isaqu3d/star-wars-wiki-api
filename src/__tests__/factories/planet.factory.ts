import { faker } from "@faker-js/faker";
import type { Planet } from "../../modules/planets/types/planets.types";

/**
 * Generate a fake planet for testing
 */
export const createFakePlanet = (overrides?: Partial<Planet>): Planet => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.location.city(),
    rotation_period: faker.number.int({ min: 10, max: 50 }).toString(),
    orbital_period: faker.number.int({ min: 200, max: 500 }).toString(),
    diameter: faker.number.int({ min: 5000, max: 20000 }).toString(),
    climate: faker.helpers.arrayElement([
      "arid",
      "temperate",
      "tropical",
      "frozen",
      "murky",
    ]),
    gravity: `${faker.number.float({ min: 0.5, max: 2.0, fractionDigits: 1 })} standard`,
    terrain: faker.helpers.arrayElement([
      "desert",
      "grasslands",
      "mountains",
      "jungle",
      "ocean",
      "ice caves",
    ]),
    surface_water: faker.number.int({ min: 0, max: 100 }).toString(),
    population: faker.number.int({ min: 0, max: 10000000000 }).toString(),
    ...overrides,
  };
};

/**
 * Generate multiple fake planets
 */
export const createFakePlanets = (count: number = 5): Planet[] => {
  return Array.from({ length: count }, () => createFakePlanet());
};

/**
 * Create a planet without ID (for creation tests)
 */
export const createFakePlanetData = (
  overrides?: Partial<Omit<Planet, "id">>
): Omit<Planet, "id"> => {
  const planet = createFakePlanet();
  const { id, ...planetData } = planet;
  return { ...planetData, ...overrides };
};

/**
 * Star Wars themed planet generator
 */
export const createStarWarsPlanet = (overrides?: Partial<Planet>): Planet => {
  const planets = [
    {
      name: "Tatooine",
      climate: "arid",
      terrain: "desert",
      population: "200000",
    },
    {
      name: "Alderaan",
      climate: "temperate",
      terrain: "grasslands, mountains",
      population: "2000000000",
    },
    {
      name: "Hoth",
      climate: "frozen",
      terrain: "tundra, ice caves",
      population: "unknown",
    },
    {
      name: "Dagobah",
      climate: "murky",
      terrain: "swamp, jungles",
      population: "unknown",
    },
    {
      name: "Coruscant",
      climate: "temperate",
      terrain: "cityscape, mountains",
      population: "1000000000000",
    },
  ];

  const planet = faker.helpers.arrayElement(planets);

  return {
    id: faker.number.int({ min: 1, max: 100 }),
    name: planet.name,
    rotation_period: faker.number.int({ min: 20, max: 30 }).toString(),
    orbital_period: faker.number.int({ min: 300, max: 400 }).toString(),
    diameter: faker.number.int({ min: 8000, max: 15000 }).toString(),
    climate: planet.climate,
    gravity: `${faker.number.float({ min: 0.8, max: 1.2, fractionDigits: 1 })} standard`,
    terrain: planet.terrain,
    surface_water: faker.number.int({ min: 0, max: 100 }).toString(),
    population: planet.population,
    ...overrides,
  };
};
