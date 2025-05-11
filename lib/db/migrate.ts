import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

async function runMigration() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // initialize connection to the database
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("All migrations completed successfully");
  } catch (error) {
    console.log("Migration failed", error);
    process.exit(1);
  }
}

runMigration();
