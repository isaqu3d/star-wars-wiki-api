"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filmRoutes = void 0;
const film_handler_1 = require("./film.handler");
const filmRoutes = async (server) => {
    server.register(film_handler_1.getFilmsHandler);
    server.register(film_handler_1.getFilmByIdHandler);
};
exports.filmRoutes = filmRoutes;
