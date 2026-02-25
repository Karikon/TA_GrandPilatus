import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         age:
 *           type: integer
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *         address:
 *           type: object
 *           properties:
 *             street: { type: string }
 *             zip: { type: string }
 *             city: { type: string }
 *             country: { type: string }
 */

const addressSchema = new Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String,
}, { _id: false });

const customerSchema = new Schema({
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    age: { type: Number, required: true },
    interests: { type: [String], default: [] },
    address: { type: addressSchema, required: true },
}, { timestamps: true });

export const Customer = model("Customer", customerSchema);
