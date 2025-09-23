"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planetRoutes = void 0;
const planet_handler_1 = require("./planet.handler");
const planetRoutes = async (server) => {
    server.register(planet_handler_1.getPlanetsHandler);
    server.register(planet_handler_1.getPlanetByIdHandler);
};
exports.planetRoutes = planetRoutes;
