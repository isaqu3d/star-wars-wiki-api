import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  getVehiclesHandler,
  getVehicleByIdHandler,
} from "./vehicle.handler";

export const vehicleRoutes: FastifyPluginAsyncZod = async (server) => {
  server.register(getVehiclesHandler);
  server.register(getVehicleByIdHandler);
};