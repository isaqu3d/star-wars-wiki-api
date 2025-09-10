import { db } from "./client";
import {
  character_films,
  character_starships,
  character_vehicles,
  characters,
  films,
  planet_films,
  planets,
  starship_films,
  starships,
  vehicles,
} from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const planetsInsert = await db
    .insert(planets)
    .values([
      {
        name: "Tatooine",
        rotation_period: "23",
        orbital_period: "304",
        diameter: "10465",
        climate: "arid",
        gravity: "1 standard",
        terrain: "desert",
        surface_water: "1",
        population: "200000",
      },
      {
        name: "Alderaan",
        rotation_period: "24",
        orbital_period: "364",
        diameter: "12500",
        climate: "temperate",
        gravity: "1 standard",
        terrain: "grasslands, mountains",
        surface_water: "40",
        population: "2000000000",
      },
    ])
    .returning();

  const charactersInsert = await db
    .insert(characters)
    .values([
      {
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        hair_color: "blond",
        skin_color: "fair",
        eye_color: "blue",
        birth_year: "19BBY",
        gender: "male",
        homeworld_id: planetsInsert[0].id,
      },
      {
        name: "Leia Organa",
        height: "150",
        mass: "49",
        hair_color: "brown",
        skin_color: "light",
        eye_color: "brown",
        birth_year: "19BBY",
        gender: "female",
        homeworld_id: planetsInsert[1].id,
      },
    ])
    .returning();

  const vehiclesInsert = await db
    .insert(vehicles)
    .values([
      {
        name: "Sand Crawler",
        model: "Digger Crawler",
        manufacturer: "Corellia Mining Corporation",
        cost_in_credits: "150000",
        length: "36.8",
        max_atmosphering_speed: "30",
        crew: "46",
        passengers: "30",
        cargo_capacity: "50000",
        consumables: "2 months",
        vehicle_class: "wheeled",
      },
      {
        name: "T-16 skyhopper",
        model: "T-16 skyhopper",
        manufacturer: "Incom Corporation",
        cost_in_credits: "14500",
        length: "10.4",
        max_atmosphering_speed: "1200",
        crew: "1",
        passengers: "1",
        cargo_capacity: "50",
        consumables: "0",
        vehicle_class: "repulsorcraft",
      },
    ])
    .returning();

  const starshipsInsert = await db
    .insert(starships)
    .values([
      {
        name: "CR90 corvette",
        model: "CR90 corvette",
        manufacturer: "Corellian Engineering Corporation",
        cost_in_credits: "3500000",
        length: "150",
        max_atmosphering_speed: "950",
        crew: "30-165",
        passengers: "600",
        cargo_capacity: "3000000",
        consumables: "1 year",
        hyperdrive_rating: "2.0",
        MGLT: "60",
        starship_class: "corvette",
      },
      {
        name: "Star Destroyer",
        model: "Imperial I-class Star Destroyer",
        manufacturer: "Kuat Drive Yards",
        cost_in_credits: "150000000",
        length: "1600",
        max_atmosphering_speed: "975",
        crew: "47060",
        passengers: "n/a",
        cargo_capacity: "36000000",
        consumables: "2 years",
        hyperdrive_rating: "2.0",
        MGLT: "60",
        starship_class: "Star Destroyer",
      },
    ])
    .returning();

  const filmsInsert = await db
    .insert(films)
    .values([
      {
        title: "A New Hope",
        episode_id: 4,
        opening_crawl: "It is a period of civil war...",
        director: "George Lucas",
        producer: "Gary Kurtz, Rick McCallum",
        release_date: "1977-05-25",
      },
    ])
    .returning();

  await db.insert(character_vehicles).values([
    { character_id: charactersInsert[0].id, vehicle_id: vehiclesInsert[0].id },
    { character_id: charactersInsert[0].id, vehicle_id: vehiclesInsert[1].id },
  ]);

  await db.insert(character_starships).values([
    {
      character_id: charactersInsert[0].id,
      starship_id: starshipsInsert[0].id,
    },
  ]);

  await db.insert(character_films).values([
    { character_id: charactersInsert[0].id, film_id: filmsInsert[0].id },
    { character_id: charactersInsert[1].id, film_id: filmsInsert[0].id },
  ]);

  await db.insert(planet_films).values([
    { planet_id: planetsInsert[0].id, film_id: filmsInsert[0].id },
    { planet_id: planetsInsert[1].id, film_id: filmsInsert[0].id },
  ]);

  await db.insert(starship_films).values([
    { starship_id: starshipsInsert[0].id, film_id: filmsInsert[0].id },
    { starship_id: starshipsInsert[1].id, film_id: filmsInsert[0].id },
  ]);

  console.log("✅ Database seeded successfully!");
}

(async () => {
  await seed();
})();
