import { Request, Response } from "express";
import { Campaign } from "../models/Campaign";
import { CampaignCreateSchema, CampaignUpdateSchema } from "../schemas/campaign.schema";

// Work out a rough status from the schedule so the UI does not have to guess
function deriveStatus(schedule?: { startAt?: string | Date; endAt?: string | Date }) {
    if (!schedule?.startAt || !schedule?.endAt) return "draft";
    const now = Date.now();
    const s = new Date(schedule.startAt).getTime();
    const e = new Date(schedule.endAt).getTime();
    if (s > now) return "scheduled";
    if (e < now) return "finished";
    return "active";
}

export async function createCampaign(req: Request, res: Response) {
    const parsed = CampaignCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const data = parsed.data;
    const status = deriveStatus(data.schedule);
    // Save the new campaign with the derived status already set
    const doc = await Campaign.create({ ...data, status });
    const populated = await doc.populate(["segments", "landingPage"]);
    res.status(201).json(populated);
}

export async function listCampaigns(req: Request, res: Response) {
    const items = await Campaign.find()
        .populate(["segments", "landingPage"])
        .lean();

    const weight: Record<string, number> = {
        active: 0,
        scheduled: 1,
        draft: 2,
        finished: 3,
    };

    items.sort((a: any, b: any) => {
        const wa = weight[a.status ?? "draft"] ?? 99;
        const wb = weight[b.status ?? "draft"] ?? 99;
        if (wa !== wb) return wa - wb;
        // Recent campaigns should win when the status tie-breaker fails
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json(items);
}


export async function getCampaign(req: Request, res: Response) {
    const item = await Campaign.findById(req.params.id).populate(["segments", "landingPage"]);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
}

export async function updateCampaign(req: Request, res: Response) {
    const parsed = CampaignUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const data = parsed.data;
    const status = deriveStatus(data.schedule);
    const item = await Campaign.findByIdAndUpdate(
        req.params.id,
        { ...data, ...(status && { status }) },
        { new: true }
    ).populate(["segments", "landingPage"]);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
}

export async function deleteCampaign(req: Request, res: Response) {
    const result = await Campaign.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
}
