import { describe, it, expect, beforeEach, vi } from "vitest";
import { VehicleRepository } from "../vehicles.repository";
import { db } from "../../../../config/database";
import {
  createStarWarsVehicle,
  createFakeVehicles,
  createFakeVehicleData,
} from "../../../../__tests__/factories/vehicle.factory";

// Mock the database
vi.mock("../../../../config/database", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    $count: vi.fn(),
  },
}));

describe("VehicleRepository", () => {
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = new VehicleRepository();
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return a vehicle when found", async () => {
      const mockVehicle = createStarWarsVehicle({
        id: 1,
        name: "Snowspeeder",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockVehicle]),
        }),
      } as any);

      const result = await vehicleRepository.findById(1);

      expect(result).toEqual(mockVehicle);
      expect(result?.name).toBe("Snowspeeder");
    });

    it("should return null when vehicle not found", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await vehicleRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return vehicles with pagination", async () => {
      const mockVehicles = createFakeVehicles(3);

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockVehicles),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(3);

      const result = await vehicleRepository.findAll({ limit: 10, offset: 0 });

      expect(result.data).toEqual(mockVehicles);
      expect(result.total).toBe(3);
      expect(result.data).toHaveLength(3);
    });

    it("should filter vehicles by search term", async () => {
      const snowspeeder = createStarWarsVehicle({
        name: "Snowspeeder",
      });

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([snowspeeder]),
              }),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.$count).mockResolvedValue(1);

      const result = await vehicleRepository.findAll({ search: "Snowspeeder" });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toContain("Snowspeeder");
    });
  });

  describe("create", () => {
    it("should create a new vehicle", async () => {
      const newVehicleData = createFakeVehicleData({
        name: "Test Vehicle",
      });
      const createdVehicle = { id: 1, ...newVehicleData };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdVehicle]),
        }),
      } as any);

      const result = await vehicleRepository.create(newVehicleData);

      expect(result).toEqual(createdVehicle);
      expect(result.name).toBe("Test Vehicle");
    });
  });

  describe("update", () => {
    it("should update an existing vehicle", async () => {
      const updatedVehicle = createStarWarsVehicle({
        id: 1,
        name: "Updated Vehicle",
      });

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedVehicle]),
          }),
        }),
      } as any);

      const result = await vehicleRepository.update(1, { name: "Updated Vehicle" });

      expect(result).toEqual(updatedVehicle);
      expect(result?.name).toBe("Updated Vehicle");
    });

    it("should return null when updating non-existent vehicle", async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await vehicleRepository.update(999, { name: "Test" });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing vehicle", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      } as any);

      const result = await vehicleRepository.delete(1);

      expect(result).toBe(true);
    });

    it("should return false when deleting non-existent vehicle", async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const result = await vehicleRepository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe("exists", () => {
    it("should return true when vehicle exists", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      } as any);

      const result = await vehicleRepository.exists(1);

      expect(result).toBe(true);
    });

    it("should return false when vehicle does not exist", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const result = await vehicleRepository.exists(999);

      expect(result).toBe(false);
    });
  });
});
