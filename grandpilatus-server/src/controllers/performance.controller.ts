import { Request, Response } from "express";
import { PerformanceService } from "../services/performance.service";

export async function getPerformance(_req: Request, res: Response) {
    const data = await PerformanceService.getMetrics();
    res.json(data);
}
