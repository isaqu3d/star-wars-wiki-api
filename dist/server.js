"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const environment_1 = require("./config/environment");
app_1.server.listen({ port: environment_1.config.port, host: environment_1.config.host }).then(() => {
    console.log(`HTTP server running on port ${environment_1.config.port}!`);
});
