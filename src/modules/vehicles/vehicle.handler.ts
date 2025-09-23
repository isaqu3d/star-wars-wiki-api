import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  vehicleIdParamSchema,
  vehicleQueryParamsSchema,
  vehicleResponseSchema,
  vehiclesResponseSchema,
} from "./vehicle.schema";
import { getVehicles, getVehicleById } from "./vehicle.service";

export const getVehiclesHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/vehicles",
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
    async (request) => {
      return getVehicles(request.query);
    }
  );
};

export const getVehicleByIdHandler: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/vehicles/:id",
    {
      schema: {
        tags: ["Vehicles"],
        summary: "Get a vehicle by ID",
        params: vehicleIdParamSchema,
        response: {
          200: vehicleResponseSchema,
          400: z.object({ error: z.string() }).describe("Invalid request"),
          404: z.object({ message: z.string() }).describe("Vehicle not found"),
        },
      },
    },
    async (request, reply) => {
      const vehicle = await getVehicleById(request.params.id);

      if (!vehicle) {
        return reply.status(404).send({ message: "Vehicle not found" });
      }

      return { vehicle };
    }
  );
};