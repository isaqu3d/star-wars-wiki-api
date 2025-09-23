CREATE TABLE "character_films" (
	"character_id" integer NOT NULL,
	"film_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_starships" (
	"character_id" integer NOT NULL,
	"starship_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_vehicles" (
	"character_id" integer NOT NULL,
	"vehicle_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"height" text,
	"mass" text,
	"hair_color" text,
	"skin_color" text,
	"eye_color" text,
	"birth_year" text,
	"gender" text,
	"homeworld_id" integer,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "films" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"episode_id" integer,
	"opening_crawl" text,
	"director" text,
	"producer" text,
	"release_date" text
);
--> statement-breakpoint
CREATE TABLE "planet_films" (
	"planet_id" integer NOT NULL,
	"film_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "planets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rotation_period" text,
	"orbital_period" text,
	"diameter" text,
	"climate" text,
	"gravity" text,
	"terrain" text,
	"surface_water" text,
	"population" text
);
--> statement-breakpoint
CREATE TABLE "starship_films" (
	"starship_id" integer NOT NULL,
	"film_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "starships" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"model" text,
	"manufacturer" text,
	"cost_in_credits" text,
	"length" text,
	"max_atmosphering_speed" text,
	"crew" text,
	"passengers" text,
	"cargo_capacity" text,
	"consumables" text,
	"hyperdrive_rating" text,
	"MGLT" text,
	"starship_class" text
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"model" text,
	"manufacturer" text,
	"cost_in_credits" text,
	"length" text,
	"max_atmosphering_speed" text,
	"crew" text,
	"passengers" text,
	"cargo_capacity" text,
	"consumables" text,
	"vehicle_class" text
);
--> statement-breakpoint
ALTER TABLE "character_films" ADD CONSTRAINT "character_films_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_films" ADD CONSTRAINT "character_films_film_id_films_id_fk" FOREIGN KEY ("film_id") REFERENCES "public"."films"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_starships" ADD CONSTRAINT "character_starships_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_starships" ADD CONSTRAINT "character_starships_starship_id_starships_id_fk" FOREIGN KEY ("starship_id") REFERENCES "public"."starships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_vehicles" ADD CONSTRAINT "character_vehicles_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_vehicles" ADD CONSTRAINT "character_vehicles_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_homeworld_id_planets_id_fk" FOREIGN KEY ("homeworld_id") REFERENCES "public"."planets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planet_films" ADD CONSTRAINT "planet_films_planet_id_planets_id_fk" FOREIGN KEY ("planet_id") REFERENCES "public"."planets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planet_films" ADD CONSTRAINT "planet_films_film_id_films_id_fk" FOREIGN KEY ("film_id") REFERENCES "public"."films"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starship_films" ADD CONSTRAINT "starship_films_starship_id_starships_id_fk" FOREIGN KEY ("starship_id") REFERENCES "public"."starships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starship_films" ADD CONSTRAINT "starship_films_film_id_films_id_fk" FOREIGN KEY ("film_id") REFERENCES "public"."films"("id") ON DELETE no action ON UPDATE no action;