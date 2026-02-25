import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createCampaign, listCampaigns, getCampaign, updateCampaign, deleteCampaign } from "../controllers/campaign.controller";

const r = Router();
// Every campaign route sits behind auth so we do not leak anything public
r.use(requireAuth);
/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management
 */

/**
 * @swagger
 * /api/v1/campaigns:
 *   get:
 *     summary: List all campaigns
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 *       401:
 *         description: Unauthorized
 */
r.get("/", listCampaigns);

/**
 * @swagger
 * /api/v1/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campaign created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
r.post("/", createCampaign);

/**
 * @swagger
 * /api/v1/campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id (Mongo ObjectId)
 *     responses:
 *       200:
 *         description: Campaign
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
r.get("/:id", getCampaign);

/**
 * @swagger
 * /api/v1/campaigns/{id}:
 *   patch:
 *     summary: Update a campaign (partial)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id (Mongo ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Updated campaign
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
r.patch("/:id", updateCampaign);

/**
 * @swagger
 * /api/v1/campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id (Mongo ObjectId)
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
r.delete("/:id", deleteCampaign);


export default r;
