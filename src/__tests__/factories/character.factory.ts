import { faker } from "@faker-js/faker";
import type { Character } from "../../modules/characters/types/characters.types";

/**
 * Generate a fake character for testing
 */
export const createFakeCharacter = (
  overrides?: Partial<Character>
): Character => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.person.fullName(),
    height: faker.number.int({ min: 150, max: 220 }).toString(),
    mass: faker.number.int({ min: 50, max: 150 }).toString(),
    hair_color: faker.helpers.arrayElement([
      "blond",
      "brown",
      "black",
      "red",
      "gray",
      "white",
      "none",
    ]),
    skin_color: faker.helpers.arrayElement([
      "fair",
      "light",
      "dark",
      "pale",
      "brown",
    ]),
    eye_color: faker.helpers.arrayElement([
      "blue",
      "brown",
      "green",
      "hazel",
      "gray",
    ]),
    birth_year: `${faker.number.int({ min: 1, max: 200 })}BBY`,
    gender: faker.helpers.arrayElement(["male", "female", "n/a"]),
    homeworld_id: faker.number.int({ min: 1, max: 50 }),
    image_url: faker.image.avatar(),
    ...overrides,
  };
};

/**
 * Generate multiple fake characters
 */
export const createFakeCharacters = (count: number = 5): Character[] => {
  return Array.from({ length: count }, () => createFakeCharacter());
};

/**
 * Create a character without ID (for creation tests)
 * Note: image_url is always a string (not null) to match CreateCharacterData type
 */
export const createFakeCharacterData = (
  overrides?: Partial<Omit<Character, "id">>
): any => {
  const character = createFakeCharacter();
  const { id, ...characterData } = character;
  return {
    ...characterData,
    image_url: characterData.image_url || faker.image.avatar(),
    ...overrides,
  };
};

/**
 * Star Wars themed character generator
 */
export const createStarWarsCharacter = (
  overrides?: Partial<Character>
): Character => {
  const names = [
    "Luke Skywalker",
    "Leia Organa",
    "Han Solo",
    "Darth Vader",
    "Obi-Wan Kenobi",
    "Yoda",
    "Rey",
    "Finn",
    "Poe Dameron",
  ];

  return {
    id: faker.number.int({ min: 1, max: 100 }),
    name: faker.helpers.arrayElement(names),
    height: faker.number.int({ min: 60, max: 220 }).toString(),
    mass: faker.number.int({ min: 15, max: 150 }).toString(),
    hair_color: faker.helpers.arrayElement([
      "blond",
      "brown",
      "black",
      "none",
      "white",
    ]),
    skin_color: faker.helpers.arrayElement([
      "fair",
      "light",
      "dark",
      "green",
      "gold",
    ]),
    eye_color: faker.helpers.arrayElement([
      "blue",
      "brown",
      "red",
      "yellow",
      "black",
    ]),
    birth_year: `${faker.number.int({ min: 1, max: 200 })}BBY`,
    gender: faker.helpers.arrayElement(["male", "female", "n/a"]),
    homeworld_id: faker.number.int({ min: 1, max: 10 }),
    image_url: faker.image.avatar(),
    ...overrides,
  };
};
