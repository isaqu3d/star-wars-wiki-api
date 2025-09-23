"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicleByIdHandler = exports.getVehiclesHandler = void 0;
const zod_1 = require("zod");
const vehicle_schema_1 = require("./vehicle.schema");
const vehicle_service_1 = require("./vehicle.service");
const getVehiclesHandler = async (server) => {
    server.get("/vehicles", {
        schema: {
            tags: ["Vehicles"],
            summary: "Get all vehicles",
            querystring: vehicle_schema_1.vehicleQueryParamsSchema,
            response: {
                200: vehicle_schema_1.vehiclesResponseSchema,
            },
        },
    }, async (request) => {
        return (0, vehicle_service_1.getVehicles)(request.query);
    });
};
exports.getVehiclesHandler = getVehiclesHandler;
const getVehicleByIdHandler = async (server) => {
    server.get("/vehicles/:id", {
        schema: {
            tags: ["Vehicles"],
            summary: "Get a vehicle by ID",
            params: vehicle_schema_1.vehicleIdParamSchema,
            response: {
                200: vehicle_schema_1.vehicleResponseSchema,
                400: zod_1.z.object({ error: zod_1.z.string() }).describe("Invalid request"),
                404: zod_1.z.object({ message: zod_1.z.string() }).describe("Vehicle not found"),
            },
        },
    }, async (request, reply) => {
        const vehicle = await (0, vehicle_service_1.getVehicleById)(request.params.id);
        if (!vehicle) {
            return reply.status(404).send({ message: "Vehicle not found" });
        }
        return { vehicle };
    });
};
exports.getVehicleByIdHandler = getVehicleByIdHandler;
