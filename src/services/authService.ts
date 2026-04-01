import bcrypt from "bcrypt";
import { pool } from "../config/db";

const signupService = async (email: string, password: string) => {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    console.log("Inserted user:", result.rows);
    return result.rows[0];

  } catch (err) {
    console.error("DB error:", err);
    throw err;
  }
};

const loginService = async (email: string, password: string) => {

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
  };
};

export { signupService, loginService };