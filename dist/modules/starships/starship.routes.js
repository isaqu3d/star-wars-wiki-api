"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starshipRoutes = void 0;
const starship_handler_1 = require("./starship.handler");
const starshipRoutes = async (server) => {
    server.register(starship_handler_1.getStarshipsHandler);
    server.register(starship_handler_1.getStarshipByIdHandler);
};
exports.starshipRoutes = starshipRoutes;
