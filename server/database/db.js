
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: "./config/config.env" });

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),

  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,

  max: 10,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err.message);
});

export const testDatabase = async () => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database,
        current_user AS username,
        NOW() AS connected_at
    `);

    console.log("✅ Neon database connected successfully!");
    console.log(result.rows[0]);

    return true;
  } catch (error) {
    console.error("❌ Neon connection failed:", error.message);
    return false;
  }
};

export default pool;
