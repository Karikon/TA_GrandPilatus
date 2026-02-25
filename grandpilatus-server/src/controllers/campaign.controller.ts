import { Request, Response } from "express";
import { CampaignCreateSchema, CampaignUpdateSchema } from "../schemas/campaign.schema";
import { CampaignService } from "../services/campaign.service";

// Controller: HTTP layer only – validates input, delegates to CampaignService, returns HTTP response.

export async function createCampaign(req: Request, res: Response) {
    const parsed = CampaignCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const doc = await CampaignService.create(parsed.data);
    res.status(201).json(doc);
}

export async function listCampaigns(_req: Request, res: Response) {
    // Sorting by status priority is handled in the service.
    res.json(await CampaignService.list());
}

export async function getCampaign(req: Request, res: Response) {
    const item = await CampaignService.getById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
}

export async function updateCampaign(req: Request, res: Response) {
    const parsed = CampaignUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const item = await CampaignService.update(req.params.id, parsed.data);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
}

export async function deleteCampaign(req: Request, res: Response) {
    const result = await CampaignService.delete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
}
