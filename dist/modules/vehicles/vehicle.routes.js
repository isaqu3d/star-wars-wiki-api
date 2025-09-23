"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const vehicle_handler_1 = require("./vehicle.handler");
const vehicleRoutes = async (server) => {
    server.register(vehicle_handler_1.getVehiclesHandler);
    server.register(vehicle_handler_1.getVehicleByIdHandler);
};
exports.vehicleRoutes = vehicleRoutes;
