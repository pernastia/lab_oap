import { type Request, type Response, type NextFunction } from "express";

export function validate(validator: (data: any) => any[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validator(req.body);
    if (errors.length > 0) {
      return next({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: errors,
      });
    }

    next();
  };
}
