import { z } from "zod";
// Keep validation tight so the API errors early instead of saving bad data
const isoDatetime = z.string().refine(v => !Number.isNaN(Date.parse(v)), "Invalid ISO date-time");
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const CampaignCreateSchema = z.object({
    name: z.string().min(2),
    segments: z.array(objectId).default([]),
    landingPage: objectId.optional(), // NEW
    segmentCriteria: z.record(z.string(), z.unknown()).optional(),
    schedule: z.object({
        startAt: isoDatetime.optional(),
        endAt: isoDatetime.optional(),
    }).optional().refine((s) => {
        if (!s) return true;
        if (s.startAt && s.endAt) return new Date(s.endAt) > new Date(s.startAt);
        return !(s.startAt || s.endAt);
    }, { message: "Provide both startAt and endAt, and endAt must be after startAt" }),
});

export const CampaignUpdateSchema = CampaignCreateSchema.partial();
