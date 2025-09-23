import { z } from "zod";
import { config as dotenvConfig } from "dotenv";

// Load environment variables from .env file
dotenvConfig();

const envSchema = z.object({
  PORT: z.string().default("3333").transform(Number),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Database - Make optional for development
  DATABASE_URL: z.string().optional(),

  // AWS/R2 Configuration
  R2_ENDPOINT: z.string().url().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),

  // Optional AWS fallback
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

function validateEnvironment() {
  try {
    const env = {
      PORT: process.env["PORT"],
      NODE_ENV: process.env["NODE_ENV"],
      DATABASE_URL: process.env["DATABASE_URL"],
      R2_ENDPOINT: process.env["R2_ENDPOINT"],
      R2_ACCESS_KEY_ID: process.env["R2_ACCESS_KEY_ID"],
      R2_SECRET_ACCESS_KEY: process.env["R2_SECRET_ACCESS_KEY"],
      R2_BUCKET_NAME: process.env["R2_BUCKET_NAME"],
      R2_ACCOUNT_ID: process.env["R2_ACCOUNT_ID"],
      AWS_REGION: process.env["AWS_REGION"],
      AWS_ACCESS_KEY_ID: process.env["AWS_ACCESS_KEY_ID"],
      AWS_SECRET_ACCESS_KEY: process.env["AWS_SECRET_ACCESS_KEY"],
    };
    return envSchema.parse(env);
  } catch (error) {
    console.error("❌ Invalid environment variables:");
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: any) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
}

const env = validateEnvironment();

export const config = {
  port: env.PORT,
  host: "0.0.0.0",
  nodeEnv: env.NODE_ENV,

  // Database
  databaseUrl: env.DATABASE_URL,

  // Storage
  r2: {
    endpoint: env.R2_ENDPOINT,
    accessKeyId: env.R2_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY,
    bucketName: env.R2_BUCKET_NAME,
    accountId: env.R2_ACCOUNT_ID,
    region: env.AWS_REGION || "us-east-1",
  },

  // Feature flags
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
} as const;

// Validate required configurations at startup
if (config.isProduction && !config.databaseUrl) {
  console.error("❌ DATABASE_URL is required in production");
  process.exit(1);
}

// Provide development defaults
if (config.isDevelopment && !config.databaseUrl) {
  console.warn("⚠️  DATABASE_URL not set, using development default");
}