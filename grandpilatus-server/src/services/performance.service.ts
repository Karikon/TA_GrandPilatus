import { CampaignRepository } from "../repositories/campaign.repository";

// Deterministic PRNG so each campaign always gets the same simulated numbers.
function hashStringToSeed(str: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return h || 1;
}

// Mulberry32 – fast, good-enough random number generator seeded per campaign ID.
function mulberry32(a: number) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Round to 1 decimal place for cleaner KPI display.
const r1 = (n: number) => Math.round(n * 10) / 10;

// Business logic for campaign performance metrics.
export const PerformanceService = {
    async getMetrics() {
        const campaigns = await CampaignRepository.findAll() as any[];
        return campaigns.map((c) => {
            const rnd = mulberry32(hashStringToSeed(String(c._id)));
            const deliveryRate = r1(85 + rnd() * 14);   // 85–99 %
            let clickRate = r1(1 + rnd() * 11);          // 1–12 %
            let conversionRate = r1(0.2 + rnd() * 4.8); // 0.2–5 %
            // Conversion must never exceed click rate – that would be statistically impossible.
            if (conversionRate > clickRate) {
                conversionRate = r1(Math.max(0.2, clickRate * (0.3 + rnd() * 0.5)));
            }
            return { campaignId: String(c._id), name: c.name, deliveryRate, clickRate, conversionRate };
        });
    },
};
