import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../database/schema";
import { config } from "./environment";

const connectionString = config.databaseUrl || "postgresql://localhost:5432/starwars_dev";

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });