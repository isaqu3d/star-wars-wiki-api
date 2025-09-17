import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client";
import { films } from "../../database/schema";

export const GetFilmsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/films",
    {
      schema: {
        response: {
          200: z.object({}),
        },
      },
    },
    async (request, replay) => {
      const result = await db.select().from(films);
      console.log(result);
    }
  );
};
