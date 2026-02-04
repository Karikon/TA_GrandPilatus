import { Request, Response } from "express";
import { Campaign } from "../models/Campaign";

/** tiny deterministic PRNG so numbers are stable per campaign */
function hashStringToSeed(str: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return h || 1;
}
function mulberry32(a: number) {
    return function () {
        let t = (a += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const r1 = (n: number) => Math.round(n * 10) / 10; // 1 decimal

export async function getPerformance(_req: Request, res: Response) {
    const campaigns = await Campaign.find().select({ name: 1 }).lean();
    const data = campaigns.map((c) => {
        const rnd = mulberry32(hashStringToSeed(String(c._id)));
        // delivery 85–99%
        const deliveryRate = r1(85 + rnd() * 14);
        // click 1–12%
        let clickRate = r1(1 + rnd() * 11);
        // conversion 0.2–5%, but never higher than click
        let conversionRate = r1(0.2 + rnd() * 4.8);
        if (conversionRate > clickRate) {
            conversionRate = r1(Math.max(0.2, clickRate * (0.3 + rnd() * 0.5)));
        }
        return {
            campaignId: String(c._id),
            name: c.name,
            deliveryRate,
            clickRate,
            conversionRate,
        };
    });
    res.json(data);
}
