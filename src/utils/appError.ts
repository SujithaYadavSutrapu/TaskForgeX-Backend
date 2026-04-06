export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    
  }
    static badRequest(message: string) {
    return new AppError(message, 400);
    }

    static unauthorized(message: string) {
    return new AppError(message, 401);
    }
}