import { Request, Response } from "express";
import { validateAuthInput } from "../utils/authValidator";
import { loginService, signupService } from "../services/authService";

const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const error = validateAuthInput(email, password);
    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      await signupService(email, password);
      return res.status(201).json({
        message: "User created successfully"
      });

    } catch (err: any) {
    return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error"
     });
 }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const error = validateAuthInput(email, password);
    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const response = await loginService(email, password);
      return res.status(200).json({
        message: "Login successful",
        token: response.token
      });

    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error"
      });
    }
};

export { signup, login };