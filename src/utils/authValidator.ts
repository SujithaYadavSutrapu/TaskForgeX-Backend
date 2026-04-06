import { AppError } from "./appError";

export const validateAuthInput = (email: string, password: string) => {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail) {
    throw new AppError("Email cannot be empty", 400);
  }

  if (!trimmedPassword) {
    throw new AppError("Password cannot be empty", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    throw new AppError("Invalid email format", 400);
  }

  if (trimmedPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  return {
    email: trimmedEmail,
    password: trimmedPassword,
  };
};