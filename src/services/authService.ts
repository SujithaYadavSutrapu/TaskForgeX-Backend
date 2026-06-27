import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

const signupService = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });
     return user;
  } catch (error: any) {
    // Prisma unique constraint error
    if (error.code === "P2002") {
      throw new AppError("User already exists", 409);
    }
    throw error;
  }
};

const loginService = async (email: string, password: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT secret not configured", 500);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    userId: user.id,
    email: user.email,
    token,
  };
};

export { signupService, loginService };
