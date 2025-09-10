import "dotenv/config"; // garante que process.env.DATABASE_URL esteja definido
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("The DATABASE_URL env is required.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  logger: process.env.NODE_ENV === "development",
});
