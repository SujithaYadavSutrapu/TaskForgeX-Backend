import bcrypt from "bcrypt";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

const signupService = async (email: string, password: string) => {
  // Check if user exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError("User already exists", 409); // 🔥 409 Conflict
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const result = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [email, hashedPassword]
  );

  return result.rows[0];
};

const loginService = async (email: string, password: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new AppError("Invalid credentials", 401);
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }
  if (!process.env.JWT_SECRET) {
  throw new AppError("JWT secret not configured", 500);
  }
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {  
    userId: user.id,
    email: user.email,
    token,
  };
};

export { signupService, loginService };