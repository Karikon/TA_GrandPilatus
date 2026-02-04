import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    // Keep the auth flow explicit: no header means no access
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    try {
        const token = header.substring(7);
        const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
        // Attach the user id so downstream handlers can trust it later
        (req as any).userId = payload.sub;
        next();
    } catch {
        res.status(401).json({ error: "Unauthorized" });
    }
}
