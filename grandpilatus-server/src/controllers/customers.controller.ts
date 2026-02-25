import { Request, Response } from "express";
import { CustomerRepository } from "../repositories/customer.repository";

export async function listCustomers(_req: Request, res: Response) {
    const items = await CustomerRepository.findAll();
    res.json(items);
}
