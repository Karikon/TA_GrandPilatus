import { Request, Response } from "express";
import { LandingPageCreateSchema, LandingPageUpdateSchema } from "../schemas/landingPage.schema";
import { LandingPageService, LandingPageInUseError } from "../services/landingPage.service";

// Controller: HTTP layer only – validates input, delegates to LandingPageService.

export async function createLandingPage(req: Request, res: Response) {
    const parsed = LandingPageCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const doc = await LandingPageService.create(parsed.data);
    res.status(201).json(doc);
}

export async function listLandingPages(_req: Request, res: Response) {
    res.json(await LandingPageService.list());
}

export async function getLandingPage(req: Request, res: Response) {
    const doc = await LandingPageService.getById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
}

export async function updateLandingPage(req: Request, res: Response) {
    const parsed = LandingPageUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const doc = await LandingPageService.update(req.params.id, parsed.data);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
}

export async function deleteLandingPage(req: Request, res: Response) {
    try {
        const ok = await LandingPageService.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: "Not found" });
        res.status(204).send();
    } catch (err) {
        // Service throws LandingPageInUseError when campaigns still reference this page.
        if (err instanceof LandingPageInUseError) {
            return res.status(409).json({ error: err.message });
        }
        throw err;
    }
}
