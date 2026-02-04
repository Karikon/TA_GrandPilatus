import { z } from "zod";

// Let the form validation reuse the same shape the API trusts
export const LandingPageCreateSchema = z.object({
    title: z.string().min(2),
    bodyHtml: z.string().min(1),
    url: z.string().url(),
    status: z.enum(["draft", "published"]).default("draft"),
});

export const LandingPageUpdateSchema = LandingPageCreateSchema.partial();
