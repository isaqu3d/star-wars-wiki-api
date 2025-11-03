import { faker } from "@faker-js/faker";
import type { Starship } from "../../modules/starships/types/starships.types";

/**
 * Generate a fake starship for testing
 */
export const createFakeStarship = (
  overrides?: Partial<Starship>
): Starship => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
    model: faker.vehicle.model(),
    manufacturer: faker.company.name(),
    cost_in_credits: faker.number.int({ min: 10000, max: 10000000 }).toString(),
    length: faker.number.int({ min: 10, max: 1000 }).toString(),
    max_atmosphering_speed: faker.number.int({ min: 500, max: 2000 }).toString(),
    crew: faker.number.int({ min: 1, max: 100 }).toString(),
    passengers: faker.number.int({ min: 0, max: 500 }).toString(),
    cargo_capacity: faker.number.int({ min: 100, max: 100000 }).toString(),
    consumables: faker.helpers.arrayElement([
      "1 day",
      "1 week",
      "1 month",
      "6 months",
      "1 year",
      "2 years",
    ]),
    hyperdrive_rating: faker.number.float({ min: 0.5, max: 4, fractionDigits: 1 }).toString(),
    MGLT: faker.number.int({ min: 10, max: 120 }).toString(),
    starship_class: faker.helpers.arrayElement([
      "Starfighter",
      "Cruiser",
      "Corvette",
      "Freighter",
      "Transport",
    ]),
    ...overrides,
  };
};

/**
 * Generate multiple fake starships
 */
export const createFakeStarships = (count: number = 5): Starship[] => {
  return Array.from({ length: count }, () => createFakeStarship());
};

/**
 * Create a starship without ID (for creation tests)
 */
export const createFakeStarshipData = (
  overrides?: Partial<Omit<Starship, "id">>
): Omit<Starship, "id"> => {
  const starship = createFakeStarship();
  const { id, ...starshipData } = starship;
  return { ...starshipData, ...overrides };
};

/**
 * Star Wars themed starship generator
 */
export const createStarWarsStarship = (
  overrides?: Partial<Starship>
): Starship => {
  const starships = [
    {
      name: "Millennium Falcon",
      model: "YT-1300 light freighter",
      manufacturer: "Corellian Engineering Corporation",
      starship_class: "Light freighter",
    },
    {
      name: "X-wing",
      model: "T-65 X-wing",
      manufacturer: "Incom Corporation",
      starship_class: "Starfighter",
    },
    {
      name: "TIE Fighter",
      model: "Twin Ion Engine Fighter",
      manufacturer: "Sienar Fleet Systems",
      starship_class: "Starfighter",
    },
    {
      name: "Star Destroyer",
      model: "Imperial I-class Star Destroyer",
      manufacturer: "Kuat Drive Yards",
      starship_class: "Star Destroyer",
    },
  ];

  const starship = faker.helpers.arrayElement(starships);

  return {
    id: faker.number.int({ min: 1, max: 100 }),
    name: starship.name,
    model: starship.model,
    manufacturer: starship.manufacturer,
    cost_in_credits: faker.number.int({ min: 100000, max: 10000000 }).toString(),
    length: faker.number.int({ min: 10, max: 2000 }).toString(),
    max_atmosphering_speed: faker.number.int({ min: 800, max: 1500 }).toString(),
    crew: faker.number.int({ min: 1, max: 50000 }).toString(),
    passengers: faker.number.int({ min: 0, max: 10000 }).toString(),
    cargo_capacity: faker.number.int({ min: 1000, max: 1000000 }).toString(),
    consumables: faker.helpers.arrayElement([
      "1 week",
      "2 months",
      "6 years",
    ]),
    hyperdrive_rating: faker.number.float({ min: 0.5, max: 2, fractionDigits: 1 }).toString(),
    MGLT: faker.number.int({ min: 60, max: 105 }).toString(),
    starship_class: starship.starship_class,
    ...overrides,
  };
};
