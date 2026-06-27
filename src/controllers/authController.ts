import { Request, Response } from "express";
import { validateAuthInput } from "../utils/authValidator";
import { loginService, signupService } from "../services/authService";
import { AppError } from "../utils/appError";
//login and sign up controller
const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Both Email and password are required", 400);
  }
  
  const { email: cleanEmail, password: cleanPassword } = validateAuthInput(email, password);

  await signupService(cleanEmail, cleanPassword);

  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
};

const login = async (req: Request, res: Response) : Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Missing fields", 400);
  }

  const { email: cleanEmail, password: cleanPassword } =
  validateAuthInput(email, password);

  const response = await loginService(cleanEmail, cleanPassword);

  res.status(200).json({
    success: true,
    message: "Login successful",
     user: {
      id: response.userId,
      email: response.email,
    },
    token: response.token,
  });
};

export { signup, login };