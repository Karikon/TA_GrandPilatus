import { CampaignRepository } from "../repositories/campaign.repository";

// Business logic for campaigns – status derivation and sort order live here, not in the controller.

/** Derives the current campaign status from its schedule. */
export function deriveStatus(schedule?: { startAt?: string | Date; endAt?: string | Date }): string {
    if (!schedule?.startAt || !schedule?.endAt) return "draft";
    const now = Date.now();
    const s = new Date(schedule.startAt).getTime();
    const e = new Date(schedule.endAt).getTime();
    if (s > now) return "scheduled";
    if (e < now) return "finished";
    return "active";
}

// Priority order: active campaigns appear first, finished ones last.
const STATUS_WEIGHT: Record<string, number> = {
    active: 0,
    scheduled: 1,
    draft: 2,
    finished: 3,
};

export const CampaignService = {
    async create(data: any) {
        const status = deriveStatus(data.schedule);
        const doc = await CampaignRepository.create({ ...data, status });
        return doc.populate(["segments", "landingPage"]);
    },

    async list() {
        const items = await CampaignRepository.findAll() as any[];
        // Sort by status priority; break ties by newest first.
        return items.sort((a, b) => {
            const wa = STATUS_WEIGHT[a.status ?? "draft"] ?? 99;
            const wb = STATUS_WEIGHT[b.status ?? "draft"] ?? 99;
            if (wa !== wb) return wa - wb;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    },

    async getById(id: string) {
        return CampaignRepository.findById(id);
    },

    async update(id: string, data: any) {
        // Recalculate status whenever schedule changes.
        const status = deriveStatus(data.schedule);
        return CampaignRepository.update(id, { ...data, ...(status && { status }) });
    },

    async delete(id: string) {
        return CampaignRepository.delete(id);
    },
};
