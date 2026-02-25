import { Request, Response } from "express";
import { SegmentCreateSchema, SegmentUpdateSchema } from "../schemas/segment.schema";
import { SegmentService } from "../services/segment.service";

export async function createSegment(req: Request, res: Response) {
    const parsed = SegmentCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const seg = await SegmentService.create(parsed.data);
    res.status(201).json(seg);
}

export async function listSegments(_req: Request, res: Response) {
    res.json(await SegmentService.list());
}

export async function getSegment(req: Request, res: Response) {
    const seg = await SegmentService.getById(req.params.id);
    if (!seg) return res.status(404).json({ error: "Not found" });
    res.json(seg);
}

export async function updateSegment(req: Request, res: Response) {
    const parsed = SegmentUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const seg = await SegmentService.update(req.params.id, parsed.data);
    if (!seg) return res.status(404).json({ error: "Not found" });
    res.json(seg);
}

export async function deleteSegment(req: Request, res: Response) {
    const result = await SegmentService.delete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
}
