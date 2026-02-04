import { Request, Response } from "express";
import { Customer } from "../models/Customer";

export async function listCustomers(_req: Request, res: Response) {
    // Return people in name order so lookups feel natural in the UI
    const items = await Customer.find().sort({ lastName: 1, firstName: 1 }).lean();
    res.json(items);
}
