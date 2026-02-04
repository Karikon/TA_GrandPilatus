import { Request, Response } from "express";
import { CustomerSegment } from "../models/CustomerSegment";
import { SegmentCreateSchema, SegmentUpdateSchema } from "../schemas/segment.schema";

export async function createSegment(req: Request, res: Response) {
    const parsed = SegmentCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    // Return the segment with customers filled so the client can render at once
    const seg = await CustomerSegment.create(parsed.data);
    res.status(201).json(await seg.populate("customers"));
}

export async function listSegments(_req: Request, res: Response) {
    const items = await CustomerSegment.find()
        .populate("customers")
        .sort({ createdAt: -1 })
        .lean();
    res.json(items);
}

export async function getSegment(req: Request, res: Response) {
    const seg = await CustomerSegment.findById(req.params.id).populate("customers").lean();
    if (!seg) return res.status(404).json({ error: "Not found" });
    res.json(seg);
}

export async function updateSegment(req: Request, res: Response) {
    const parsed = SegmentUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const seg = await CustomerSegment.findByIdAndUpdate(req.params.id, parsed.data, { new: true })
        .populate("customers")
        .lean();
    if (!seg) return res.status(404).json({ error: "Not found" });
    res.json(seg);
}

export async function deleteSegment(req: Request, res: Response) {
    // Simple delete: nothing references segments directly for now
    const result = await CustomerSegment.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
}
