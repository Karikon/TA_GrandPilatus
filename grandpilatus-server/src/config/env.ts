import * as dotenv from "dotenv";
dotenv.config();

type Env = {
    PORT: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    REFRESH_SECRET: string;
    REFRESH_EXPIRES_IN: string;
};

const must = (key: string): string => {
    const v = process.env[key];
    // Fail hard during boot when a required env var is not provided
    if (!v) throw new Error(`${key} missing`);
    return v;
};

export const env: Env = {
    PORT: process.env.PORT ?? "4000",
    MONGO_URI: must("MONGO_URI"),
    JWT_SECRET: must("JWT_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "15m",
    REFRESH_SECRET: must("REFRESH_SECRET"),
    REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN ?? "7d",
};
