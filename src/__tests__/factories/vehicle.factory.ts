import { faker } from "@faker-js/faker";
import type { Vehicle } from "../../modules/vehicles/types/vehicles.types";

/**
 * Generate a fake vehicle for testing
 */
export const createFakeVehicle = (
  overrides?: Partial<Vehicle>
): Vehicle => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: `${faker.vehicle.manufacturer()} ${faker.vehicle.type()}`,
    model: faker.vehicle.model(),
    manufacturer: faker.company.name(),
    cost_in_credits: faker.number.int({ min: 1000, max: 500000 }).toString(),
    length: faker.number.int({ min: 3, max: 50 }).toString(),
    max_atmosphering_speed: faker.number.int({ min: 50, max: 500 }).toString(),
    crew: faker.number.int({ min: 1, max: 20 }).toString(),
    passengers: faker.number.int({ min: 0, max: 100 }).toString(),
    cargo_capacity: faker.number.int({ min: 50, max: 50000 }).toString(),
    consumables: faker.helpers.arrayElement([
      "1 day",
      "1 week",
      "2 weeks",
      "1 month",
      "6 months",
    ]),
    vehicle_class: faker.helpers.arrayElement([
      "speeder",
      "transport",
      "walker",
      "airspeeder",
      "repulsorcraft",
    ]),
    ...overrides,
  };
};

/**
 * Generate multiple fake vehicles
 */
export const createFakeVehicles = (count: number = 5): Vehicle[] => {
  return Array.from({ length: count }, () => createFakeVehicle());
};

/**
 * Create a vehicle without ID (for creation tests)
 */
export const createFakeVehicleData = (
  overrides?: Partial<Omit<Vehicle, "id">>
): Omit<Vehicle, "id"> => {
  const vehicle = createFakeVehicle();
  const { id, ...vehicleData } = vehicle;
  return { ...vehicleData, ...overrides };
};

/**
 * Star Wars themed vehicle generator
 */
export const createStarWarsVehicle = (
  overrides?: Partial<Vehicle>
): Vehicle => {
  const vehicles = [
    {
      name: "Sand Crawler",
      model: "Digger Crawler",
      manufacturer: "Corellia Mining Corporation",
      vehicle_class: "wheeled",
    },
    {
      name: "Snowspeeder",
      model: "t-47 airspeeder",
      manufacturer: "Incom Corporation",
      vehicle_class: "airspeeder",
    },
    {
      name: "AT-AT",
      model: "All Terrain Armored Transport",
      manufacturer: "Kuat Drive Yards",
      vehicle_class: "assault walker",
    },
    {
      name: "Speeder Bike",
      model: "74-Z speeder bike",
      manufacturer: "Aratech Repulsor Company",
      vehicle_class: "speeder",
    },
  ];

  const vehicle = faker.helpers.arrayElement(vehicles);

  return {
    id: faker.number.int({ min: 1, max: 100 }),
    name: vehicle.name,
    model: vehicle.model,
    manufacturer: vehicle.manufacturer,
    cost_in_credits: faker.number.int({ min: 10000, max: 500000 }).toString(),
    length: faker.number.int({ min: 5, max: 40 }).toString(),
    max_atmosphering_speed: faker.number.int({ min: 100, max: 400 }).toString(),
    crew: faker.number.int({ min: 1, max: 50 }).toString(),
    passengers: faker.number.int({ min: 0, max: 100 }).toString(),
    cargo_capacity: faker.number.int({ min: 100, max: 100000 }).toString(),
    consumables: faker.helpers.arrayElement([
      "1 day",
      "2 weeks",
      "1 month",
    ]),
    vehicle_class: vehicle.vehicle_class,
    ...overrides,
  };
};
