import pkg from "pg";
import dotenv from "dotenv";
import path from "path";

const { Pool } = pkg;

dotenv.config({ path: path.resolve("./src/env/.env") });

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false },
});
