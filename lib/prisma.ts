import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { appConfig } from "../config/app";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Use the database URL from appConfig. SSL is required for secure connections.
const connectionString = appConfig.database.url;

const pool = new pg.Pool({
  connectionString,
  ssl: appConfig.database.ssl ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["query", "warn", "error"],
  });


// Prevent multiple instances in dev / Lambda reuse
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;