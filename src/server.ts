import { server } from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

server.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server running on port ${PORT}!`);
});
