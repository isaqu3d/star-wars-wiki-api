"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterRoutes = void 0;
const character_handler_1 = require("./character.handler");
const characterRoutes = async (server) => {
    server.register(character_handler_1.createCharacterHandler);
    server.register(character_handler_1.getCharactersHandler);
    server.register(character_handler_1.getCharacterByIdHandler);
};
exports.characterRoutes = characterRoutes;
