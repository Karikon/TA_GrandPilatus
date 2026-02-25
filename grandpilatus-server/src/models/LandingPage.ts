import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     LandingPage:
 *       type: object
 *       required: [title, bodyHtml, url, status]
 *       properties:
 *         _id: { type: string }
 *         title: { type: string, example: "Autumn Spa Retreat" }
 *         bodyHtml: { type: string, example: "<h1>Welcome</h1>..." }
 *         url: { type: string, example: "https://hotel.example.com/autumn-spa" }
 *         status:
 *           type: string
 *           enum: [draft, published]
 */
// Basic CMS style model so marketing pages can be reused across campaigns
const landingPageSchema = new Schema(
    {
        title: { type: String, required: true },
        bodyHtml: { type: String, required: true },
        url: { type: String, required: true, unique: true },
        status: { type: String, enum: ["draft", "published"], required: true, default: "draft" },
    },
    { timestamps: true }
);

export const LandingPage = model("LandingPage", landingPageSchema);
