import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { VehicleController } from "../controllers/vehicles.controller";
import {
  vehicleQueryParamsSchema,
  vehicleIdParamSchema,
  vehicleResponseSchema,
  vehiclesResponseSchema,
  createVehicleBodySchema,
  updateVehicleSchema,
} from "../schemas/vehicles.schema";

export const vehicleRoutes: FastifyPluginAsyncZod = async (server) => {
  const vehicleController = new VehicleController();

  // Get all vehicles
  server.get(
    "/",
    {
      schema: {
        tags: ["Vehicles"],
        summary: "Get all vehicles",
        querystring: vehicleQueryParamsSchema,
        response: {
          200: vehiclesResponseSchema,
        },
      },
    },
    vehicleController.getVehicles.bind(vehicleController)
  );

  // Get vehicle by ID
  server.get(
    "/:id",
    {
      schema: {
        tags: ["Vehicles"],
        summary: "Get a vehicle by ID",
        params: vehicleIdParamSchema,
        response: {
          200: vehicleResponseSchema,
        },
      },
    },
    vehicleController.getVehicleById.bind(vehicleController)
  );

  // Create new vehicle
  server.post(
    "/",
    {
      schema: {
        tags: ["Vehicles"],
        summary: "Create a new vehicle",
        body: createVehicleBodySchema,
        response: {
          201: vehicleResponseSchema,
        },
      },
    },
    vehicleController.createVehicle.bind(vehicleController)
  );

  // Update vehicle
  server.put(
    "/:id",
    {
      schema: {
        tags: ["Vehicles"],
        summary: "Update a vehicle",
        params: vehicleIdParamSchema,
        body: updateVehicleSchema,
        response: {
          200: vehicleResponseSchema,
        },
      },
    },
    vehicleController.updateVehicle.bind(vehicleController)
  );

  // Delete vehicle
  server.delete(
    "/:id",
    {
      schema: {
        tags: ["Vehicles"],
        summary: "Delete a vehicle",
        params: vehicleIdParamSchema,
        response: {
          204: {},
        },
      },
    },
    vehicleController.deleteVehicle.bind(vehicleController)
  );
};
