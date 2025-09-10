import { defineConfig } from "drizzle-kit";


if (!process.env.DATABASE_URL) {
  throw new Error("The DATABASE_URL env is required.");
}

export default defineConfig({
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
