import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DATABASE_SSL: z
      .enum(["true", "false"])
      .optional()
      .default("true")
      .transform((value) => value === "true"),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    JWT_RESET_EXPIRES_IN: z.string().default("10m"),
    GOOGLE_CLIENT_ID: z.string().optional(),
    APPLE_CLIENT_ID: z.string().optional(),
    APPLE_AUTH_KEY: z.string().url().optional().default("https://appleid.apple.com/auth/keys"),
    BUCKET_NAME: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY_ID: z.string().optional(),
  })

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = parsed.data;
