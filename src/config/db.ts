import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "taskforgex",
  password: "Password@7",
  port: 7777,
});

pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res?.rows);
});