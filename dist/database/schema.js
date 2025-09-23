"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starship_films = exports.planet_films = exports.character_films = exports.character_starships = exports.character_vehicles = exports.films = exports.starships = exports.vehicles = exports.characters = exports.planets = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.planets = (0, pg_core_1.pgTable)("planets", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    rotation_period: (0, pg_core_1.text)("rotation_period"),
    orbital_period: (0, pg_core_1.text)("orbital_period"),
    diameter: (0, pg_core_1.text)("diameter"),
    climate: (0, pg_core_1.text)("climate"),
    gravity: (0, pg_core_1.text)("gravity"),
    terrain: (0, pg_core_1.text)("terrain"),
    surface_water: (0, pg_core_1.text)("surface_water"),
    population: (0, pg_core_1.text)("population"),
});
exports.characters = (0, pg_core_1.pgTable)("characters", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    height: (0, pg_core_1.text)("height"),
    mass: (0, pg_core_1.text)("mass"),
    hair_color: (0, pg_core_1.text)("hair_color"),
    skin_color: (0, pg_core_1.text)("skin_color"),
    eye_color: (0, pg_core_1.text)("eye_color"),
    birth_year: (0, pg_core_1.text)("birth_year"),
    gender: (0, pg_core_1.text)("gender"),
    homeworld_id: (0, pg_core_1.integer)("homeworld_id").references(() => exports.planets.id),
    image_url: (0, pg_core_1.text)("image_url").notNull(),
});
exports.vehicles = (0, pg_core_1.pgTable)("vehicles", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    model: (0, pg_core_1.text)("model"),
    manufacturer: (0, pg_core_1.text)("manufacturer"),
    cost_in_credits: (0, pg_core_1.text)("cost_in_credits"),
    length: (0, pg_core_1.text)("length"),
    max_atmosphering_speed: (0, pg_core_1.text)("max_atmosphering_speed"),
    crew: (0, pg_core_1.text)("crew"),
    passengers: (0, pg_core_1.text)("passengers"),
    cargo_capacity: (0, pg_core_1.text)("cargo_capacity"),
    consumables: (0, pg_core_1.text)("consumables"),
    vehicle_class: (0, pg_core_1.text)("vehicle_class"),
});
exports.starships = (0, pg_core_1.pgTable)("starships", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    model: (0, pg_core_1.text)("model"),
    manufacturer: (0, pg_core_1.text)("manufacturer"),
    cost_in_credits: (0, pg_core_1.text)("cost_in_credits"),
    length: (0, pg_core_1.text)("length"),
    max_atmosphering_speed: (0, pg_core_1.text)("max_atmosphering_speed"),
    crew: (0, pg_core_1.text)("crew"),
    passengers: (0, pg_core_1.text)("passengers"),
    cargo_capacity: (0, pg_core_1.text)("cargo_capacity"),
    consumables: (0, pg_core_1.text)("consumables"),
    hyperdrive_rating: (0, pg_core_1.text)("hyperdrive_rating"),
    MGLT: (0, pg_core_1.text)("MGLT"),
    starship_class: (0, pg_core_1.text)("starship_class"),
});
exports.films = (0, pg_core_1.pgTable)("films", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    episode_id: (0, pg_core_1.integer)("episode_id"),
    opening_crawl: (0, pg_core_1.text)("opening_crawl"),
    director: (0, pg_core_1.text)("director"),
    producer: (0, pg_core_1.text)("producer"),
    release_date: (0, pg_core_1.text)("release_date"),
});
// Characters ↔ Vehicles
exports.character_vehicles = (0, pg_core_1.pgTable)("character_vehicles", {
    character_id: (0, pg_core_1.integer)("character_id")
        .references(() => exports.characters.id)
        .notNull(),
    vehicle_id: (0, pg_core_1.integer)("vehicle_id")
        .references(() => exports.vehicles.id)
        .notNull(),
});
// Characters ↔ Starships
exports.character_starships = (0, pg_core_1.pgTable)("character_starships", {
    character_id: (0, pg_core_1.integer)("character_id")
        .references(() => exports.characters.id)
        .notNull(),
    starship_id: (0, pg_core_1.integer)("starship_id")
        .references(() => exports.starships.id)
        .notNull(),
});
// Characters ↔ Films
exports.character_films = (0, pg_core_1.pgTable)("character_films", {
    character_id: (0, pg_core_1.integer)("character_id")
        .references(() => exports.characters.id)
        .notNull(),
    film_id: (0, pg_core_1.integer)("film_id")
        .references(() => exports.films.id)
        .notNull(),
});
// Planets ↔ Films
exports.planet_films = (0, pg_core_1.pgTable)("planet_films", {
    planet_id: (0, pg_core_1.integer)("planet_id")
        .references(() => exports.planets.id)
        .notNull(),
    film_id: (0, pg_core_1.integer)("film_id")
        .references(() => exports.films.id)
        .notNull(),
});
// Starships ↔ Films
exports.starship_films = (0, pg_core_1.pgTable)("starship_films", {
    starship_id: (0, pg_core_1.integer)("starship_id")
        .references(() => exports.starships.id)
        .notNull(),
    film_id: (0, pg_core_1.integer)("film_id")
        .references(() => exports.films.id)
        .notNull(),
});
