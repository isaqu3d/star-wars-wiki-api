import { config as dotenvConfig } from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenvConfig();

const envSchema = z.object({
  // Server Configuration
  PORT: z.coerce.number().positive().int().default(3333),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_VERSION: z.string().default("1.0.0"),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  // Database Configuration
  DATABASE_URL: z.string().startsWith("postgresql://").optional(),
  DB_POOL_MIN: z.coerce.number().int().min(0).default(2),
  DB_POOL_MAX: z.coerce.number().int().min(1).default(10),

  // Security
  CORS_ORIGINS: z.string().optional(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW: z.string().default("1 minute"),

  // AWS/R2 Configuration (Optional)
  R2_ENDPOINT: z.string().startsWith("https://").optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),

  // AWS Fallback
  // AWS_REGION: z.string().optional(),
  // AWS_ACCESS_KEY_ID: z.string().optional(),
  // AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

function validateEnvironment() {
  try {
    const env = {
      // Server
      PORT: process.env["PORT"],
      HOST: process.env["HOST"],
      NODE_ENV: process.env["NODE_ENV"],
      API_VERSION: process.env["API_VERSION"],

      // Logging
      LOG_LEVEL: process.env["LOG_LEVEL"],

      // Database
      DATABASE_URL: process.env["DATABASE_URL"],
      DB_POOL_MIN: process.env["DB_POOL_MIN"],
      DB_POOL_MAX: process.env["DB_POOL_MAX"],

      // Security
      CORS_ORIGINS: process.env["CORS_ORIGINS"],
      RATE_LIMIT_MAX: process.env["RATE_LIMIT_MAX"],
      RATE_LIMIT_WINDOW: process.env["RATE_LIMIT_WINDOW"],

      // AWS/R2
      R2_ENDPOINT: process.env["R2_ENDPOINT"],
      R2_ACCESS_KEY_ID: process.env["R2_ACCESS_KEY_ID"],
      R2_SECRET_ACCESS_KEY: process.env["R2_SECRET_ACCESS_KEY"],
      R2_BUCKET_NAME: process.env["R2_BUCKET_NAME"],
      R2_ACCOUNT_ID: process.env["R2_ACCOUNT_ID"],
      // AWS_REGION: process.env["AWS_REGION"],
      // AWS_ACCESS_KEY_ID: process.env["AWS_ACCESS_KEY_ID"],
      // AWS_SECRET_ACCESS_KEY: process.env["AWS_SECRET_ACCESS_KEY"],
    };

    return envSchema.parse(env);
  } catch (error) {
    console.error("\n❌ Environment validation failed:");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (error instanceof z.ZodError) {
      error.issues.forEach((err: any) => {
        const path = err.path.join(".");
        console.error(`  ✘ ${path}`);
        console.error(`    ${err.message}\n`);
      });

      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("💡 Check your .env file or environment variables\n");
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

const env = validateEnvironment();

export const config = {
  // Server
  port: env.PORT,
  host: env.HOST,
  nodeEnv: env.NODE_ENV,
  apiVersion: env.API_VERSION,

  // Logging
  logLevel: env.LOG_LEVEL,

  // Database
  databaseUrl: env.DATABASE_URL,
  database: {
    poolMin: env.DB_POOL_MIN,
    poolMax: env.DB_POOL_MAX,
  },

  // Security
  cors: {
    origins: env.CORS_ORIGINS
      ? env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
      : [],
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    window: env.RATE_LIMIT_WINDOW,
  },

  // Storage (R2/AWS)
  storage: {
    endpoint: env.R2_ENDPOINT,
    accessKeyId: env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: env.R2_SECRET_ACCESS_KEY || "",
    bucketName: env.R2_BUCKET_NAME || "",
    accountId: env.R2_ACCOUNT_ID || "",
    region: "us-east-1",
  },

  // Feature flags
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
} as const;

// Production environment validation
if (config.isProduction) {
  const productionRequirements = [];

  if (!config.databaseUrl) {
    productionRequirements.push("DATABASE_URL is required in production");
  }

  if (productionRequirements.length > 0) {
    console.error("\n❌ Production environment check failed:");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    productionRequirements.forEach((req) => {
      console.error(`  ✘ ${req}`);
    });
    console.error("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  }
}

// Development warnings
if (config.isDevelopment) {
  const warnings = [];

  if (!config.databaseUrl) {
    warnings.push("DATABASE_URL not set");
  }

  if (warnings.length > 0) {
    console.warn("\n⚠️  Development environment warnings:");
    warnings.forEach((warning) => {
      console.warn(`  • ${warning}`);
    });
    console.warn("");
  }
}
