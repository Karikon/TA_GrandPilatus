import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../config/env";

const asExpiresIn = (v: string): SignOptions["expiresIn"] => v as unknown as SignOptions["expiresIn"];

export async function register(req: Request, res: Response) {
    const { email, password } = req.body;
    // Hash the password right away so we never store it in plain text
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    res.status(201).json({ id: user._id, email: user.email });
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Short lived token for API calls
    const access = jwt.sign(
        { sub: user.id },
        env.JWT_SECRET,
        { expiresIn: asExpiresIn(env.JWT_EXPIRES_IN) }
    );

    // Refresh token gives us a way to renew without forcing password entry
    const refresh = jwt.sign(
        { sub: user.id },
        env.REFRESH_SECRET,
        { expiresIn: asExpiresIn(env.REFRESH_EXPIRES_IN) }
    );

    res.json({ access, refresh });
}
