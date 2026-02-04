import { Request, Response, NextFunction } from "express";
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    // Log once here so individual handlers can stay tidy
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Server error" });
}
