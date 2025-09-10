import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { GetCharacters } from "./routes/characters/get-characters";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

// if (process.env.NODE_ENV === "development") {
//   server.register(fastifySwagger, {
//     openapi: {
//       info: {
//         title: "Node.js API",
//         version: "1.0.0",
//       },
//     },
//     transform: jsonSchemaTransform,
//   });

//   server.register(scalarAPIReference, {
//     routePrefix: "/docs",
//   });
// }

server.register(GetCharacters);

export { server };
