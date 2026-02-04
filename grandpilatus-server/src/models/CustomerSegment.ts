import { Schema, model, Types } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerSegment:
 *       type: object
 *       required: [title]
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           example: "Wellness & Spa Fans"
 *         customers:
 *           type: array
 *           items:
 *             type: string
 *             description: Customer ObjectId
 *           example: ["64f0a2c3e4f3a1b2c3d4e5f6"]
 */
// Segments stay tiny on purpose so the dashboard can load them quickly
const segmentSchema = new Schema(
    {
        title: { type: String, required: true },
        customers: [{ type: Schema.Types.ObjectId, ref: "Customer", default: [] }],
    },
    { timestamps: true }
);

export const CustomerSegment = model("CustomerSegment", segmentSchema);
