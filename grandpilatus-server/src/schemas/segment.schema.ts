import { z } from "zod";

// These IDs come straight from Mongo so we keep the pattern small and strict
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const SegmentCreateSchema = z.object({
    title: z.string().min(2),
    customers: z.array(objectId).default([]),
});

export const SegmentUpdateSchema = SegmentCreateSchema.partial();
