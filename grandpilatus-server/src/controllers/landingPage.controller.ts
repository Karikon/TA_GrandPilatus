import { Request, Response } from "express";
import { LandingPage } from "../models/LandingPage";
import { Campaign } from "../models/Campaign";
import { LandingPageCreateSchema, LandingPageUpdateSchema } from "../schemas/landingPage.schema";

export async function createLandingPage(req: Request, res: Response) {
    const parsed = LandingPageCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const doc = await LandingPage.create(parsed.data);
    res.status(201).json(doc);
}

export async function listLandingPages(_req: Request, res: Response) {
    const items = await LandingPage.find().sort({ createdAt: -1 }).lean();
    res.json(items);
}

export async function getLandingPage(req: Request, res: Response) {
    const doc = await LandingPage.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
}

export async function updateLandingPage(req: Request, res: Response) {
    const parsed = LandingPageUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const doc = await LandingPage.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
}

export async function deleteLandingPage(req: Request, res: Response) {
    const refCount = await Campaign.countDocuments({ landingPage: req.params.id });
    if (refCount > 0) return res.status(409).json({ error: "Landing page is in use by campaigns" });
    const ok = await LandingPage.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
}
