import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const planets = pgTable("planets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rotation_period: text("rotation_period"),
  orbital_period: text("orbital_period"),
  diameter: text("diameter"),
  climate: text("climate"),
  gravity: text("gravity"),
  terrain: text("terrain"),
  surface_water: text("surface_water"),
  population: text("population"),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  height: text("height"),
  mass: text("mass"),
  hair_color: text("hair_color"),
  skin_color: text("skin_color"),
  eye_color: text("eye_color"),
  birth_year: text("birth_year"),
  gender: text("gender"),
  homeworld_id: integer("homeworld_id").references(() => planets.id),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model"),
  manufacturer: text("manufacturer"),
  cost_in_credits: text("cost_in_credits"),
  length: text("length"),
  max_atmosphering_speed: text("max_atmosphering_speed"),
  crew: text("crew"),
  passengers: text("passengers"),
  cargo_capacity: text("cargo_capacity"),
  consumables: text("consumables"),
  vehicle_class: text("vehicle_class"),
});

export const starships = pgTable("starships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model"),
  manufacturer: text("manufacturer"),
  cost_in_credits: text("cost_in_credits"),
  length: text("length"),
  max_atmosphering_speed: text("max_atmosphering_speed"),
  crew: text("crew"),
  passengers: text("passengers"),
  cargo_capacity: text("cargo_capacity"),
  consumables: text("consumables"),
  hyperdrive_rating: text("hyperdrive_rating"),
  MGLT: text("MGLT"),
  starship_class: text("starship_class"),
});

export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  episode_id: integer("episode_id"),
  opening_crawl: text("opening_crawl"),
  director: text("director"),
  producer: text("producer"),
  release_date: text("release_date"),
});

// Characters ↔ Vehicles
export const character_vehicles = pgTable("character_vehicles", {
  character_id: integer("character_id")
    .references(() => characters.id)
    .notNull(),
  vehicle_id: integer("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
});

// Characters ↔ Starships
export const character_starships = pgTable("character_starships", {
  character_id: integer("character_id")
    .references(() => characters.id)
    .notNull(),
  starship_id: integer("starship_id")
    .references(() => starships.id)
    .notNull(),
});

// Characters ↔ Films
export const character_films = pgTable("character_films", {
  character_id: integer("character_id")
    .references(() => characters.id)
    .notNull(),
  film_id: integer("film_id")
    .references(() => films.id)
    .notNull(),
});

// Planets ↔ Films
export const planet_films = pgTable("planet_films", {
  planet_id: integer("planet_id")
    .references(() => planets.id)
    .notNull(),
  film_id: integer("film_id")
    .references(() => films.id)
    .notNull(),
});

// Starships ↔ Films
export const starship_films = pgTable("starship_films", {
  starship_id: integer("starship_id")
    .references(() => starships.id)
    .notNull(),
  film_id: integer("film_id")
    .references(() => films.id)
    .notNull(),
});
