import type { HeadcountRecord } from "@/types";
import { Pool } from "pg";
import type { DateRange } from "react-day-picker";

if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD environment variable is required");
}

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "19848"),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT,
  },
});

// Initialize the database by creating the table if it doesn't exist
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS headcount_records (
        id SERIAL PRIMARY KEY,
        faculty_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        lab_classroom_no TEXT NOT NULL,
        headcount INTEGER NOT NULL,
        timestamp TIMESTAMP NOT NULL
      )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
}

// Insert a new headcount record
export async function insertRecord(record: HeadcountRecord): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `
      INSERT INTO headcount_records 
        (faculty_name, subject, lab_classroom_no, headcount, timestamp)
      VALUES 
        ($1, $2, $3, $4, $5)
      `,
      [
        record.facultyName,
        record.subject,
        record.labClassroomNo,
        record.headcount,
        record.timestamp,
      ]
    );
    console.log("Record inserted successfully");
  } catch (error) {
    console.error("Error inserting record:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get all headcount records with optional date range filter
export async function getRecords(
  dateRange?: DateRange
): Promise<HeadcountRecord[]> {
  const client = await pool.connect();
  try {
    let query = `
      SELECT 
        id,
        faculty_name as "facultyName",
        subject,
        lab_classroom_no as "labClassroomNo",
        headcount,
        timestamp
      FROM 
        headcount_records
    `;

    const params: any[] = [];

    if (dateRange?.from || dateRange?.to) {
      const conditions = [];

      if (dateRange.from) {
        params.push(dateRange.from);
        conditions.push(`timestamp >= $${params.length}`);
      }

      if (dateRange.to) {
        // Add one day to include the end date fully
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        params.push(endDate);
        conditions.push(`timestamp < $${params.length}`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
    }

    query += ` ORDER BY timestamp DESC`;

    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error getting records:", error);
    throw error;
  } finally {
    client.release();
  }
}
