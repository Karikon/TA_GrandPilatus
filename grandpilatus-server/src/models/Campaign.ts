import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required: [name]
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         segments: { type: array, items: { type: string } }
 *         landingPage: { type: string, description: "LandingPage ObjectId" }
 *         segmentCriteria: { type: object, additionalProperties: true }
 *         schedule:
 *           type: object
 *           properties:
 *             startAt: { type: string, format: date-time }
 *             endAt: { type: string, format: date-time }
 *         status:
 *           type: string
 *           enum: [draft, scheduled, active, finished]
 *         metrics:
 *           type: object
 *           properties: { sent: {type: integer}, opened: {type: integer}, clicked: {type: integer} }
 */
// Keep the schema flexible enough for simple A/B testing fields later
const campaignSchema = new Schema({
    name: { type: String, required: true },
    segmentCriteria: { type: Object, default: {} },
    segments: [{ type: Schema.Types.ObjectId, ref: "CustomerSegment", default: [] }],
    landingPage: { type: Schema.Types.ObjectId, ref: "LandingPage", required: false },
    schedule: { startAt: { type: Date }, endAt: { type: Date } },
    status: { type: String, enum: ["draft", "scheduled", "active", "finished"], default: "draft" },
    metrics: { sent: { type: Number, default: 0 }, opened: { type: Number, default: 0 }, clicked: { type: Number, default: 0 } }
}, { timestamps: true });

// Speed up dashboards that pull by status and most recent items
campaignSchema.index({ status: 1, createdAt: -1 });

export const Campaign = model("Campaign", campaignSchema);
