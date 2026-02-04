import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listCustomers } from "../controllers/customers.controller";

const r = Router();
// Protect the raw customer list since it exposes guest data
r.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Read-only list of customers for segmentation
 */

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Get all customers (read-only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
r.get("/", listCustomers);

export default r;
