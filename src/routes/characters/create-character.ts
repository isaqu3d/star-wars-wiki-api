import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client";
import { characters } from "../../database/schema";

export const CreateCharacterRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/character",
    {
      schema: {
        tags: ["Characters"],
        summary: "Create character",
        body: z.object({
          name: z.string(),
          height: z.string().nullable(),
          mass: z.string().nullable(),
          hair_color: z.string().nullable(),
          skin_color: z.string().nullable(),
          eye_color: z.string().nullable(),
          birth_year: z.string().nullable(),
          gender: z.string().nullable(),
          homeworld_id: z.number().nullable(),
          image_url: z.string(),
        }),
        response: {
          201: z.object({
            name: z.string(),
            height: z.string().nullable(),
            mass: z.string().nullable(),
            hair_color: z.string().nullable(),
            skin_color: z.string().nullable(),
            eye_color: z.string().nullable(),
            birth_year: z.string().nullable(),
            gender: z.string().nullable(),
            homeworld_id: z.number().nullable(),
            image_url: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const name = request.body.name;
      const birth_year = request.body.birth_year;
      const eye_color = request.body.eye_color;
      const hair_color = request.body.hair_color;
      const gender = request.body.gender;
      const height = request.body.height;
      const homeworld_id = request.body.homeworld_id;
      const mass = request.body.mass;
      const skin_color = request.body.skin_color;
      const image_url = request.body.image_url;

      const result = await db
        .insert(characters)
        .values({
          name,
          birth_year,
          eye_color,
          gender,
          hair_color,
          height,
          homeworld_id,
          mass,
          skin_color,
          image_url,
        })
        .returning();

      return reply.status(201).send(result[0]);
    }
  );
};
