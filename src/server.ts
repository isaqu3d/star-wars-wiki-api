import { server } from "./app";
import { config } from "./config/environment";

server.listen({ port: config.port, host: config.host }).then(() => {
  console.log(`HTTP server running on port ${config.port}!`);
});
