import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getPerformance } from "../controllers/performance.controller";

const r = Router();
// Only show performance numbers to logged in staff
r.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Performance
 *   description: KPIs of the campaigns for reporting
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CampaignPerformance:
 *       type: object
 *       properties:
 *         campaignId: { type: string }
 *         name: { type: string }
 *         deliveryRate: { type: number, description: "percent 0-100", example: 92.4 }
 *         clickRate: { type: number, description: "percent 0-100", example: 6.1 }
 *         conversionRate: { type: number, description: "percent 0-100", example: 2.3 }
 */

/**
 * @swagger
 * /api/v1/performance:
 *   get:
 *     summary: Performance KPIs for all campaigns for reporting purposes
 *     tags: [Performance]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Array of campaign KPIs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/CampaignPerformance' }
 */
r.get("/", getPerformance);

export default r;
