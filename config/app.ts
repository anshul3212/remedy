import { env } from "./env";

export const appConfig = {
  nodeEnv: env.NODE_ENV,
  server: {
    port: env.PORT,
  },
  database: {
    url: env.DATABASE_URL,
    ssl: env.DATABASE_SSL,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    resetTokenExpiresIn: env.JWT_RESET_EXPIRES_IN,
    googleClientId: env.GOOGLE_CLIENT_ID,
    appleClientId: env.APPLE_CLIENT_ID,
    appleAuthKey: env.APPLE_AUTH_KEY,
  },
  aws: {
    bucket: env.BUCKET_NAME,
    region: env.AWS_REGION,
    accessKey: env.AWS_ACCESS_KEY_ID,
    secretKey: env.AWS_SECRET_ACCESS_KEY_ID,
  },
} as const;
