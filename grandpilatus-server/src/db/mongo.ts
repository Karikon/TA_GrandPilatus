import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectMongo() {
    // Make sure we fail loud if the config is not there to avoid silent hangs
    if (!env.MONGO_URI) throw new Error("MONGO_URI missing");
    await mongoose.connect(env.MONGO_URI);
    console.log("Mongo connected");
}
