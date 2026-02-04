import { Schema, model } from "mongoose";
// ADMIN users
const userSchema = new Schema({
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" }
}, { timestamps: true });

export const User = model("User", userSchema);
