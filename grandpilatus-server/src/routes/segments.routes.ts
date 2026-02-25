import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
    createSegment, listSegments, getSegment, updateSegment, deleteSegment
} from "../controllers/segments.controller";

const r = Router();
// Segment edits reveal targeting info, so keep them behind login
r.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Customer segment management
 */

/**
 * @swagger
 * /api/v1/segments:
 *   get:
 *     summary: List all segments
 *     tags: [Segments]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: List of segments (customers populated)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerSegment'
 */
r.get("/", listSegments);

/**
 * @swagger
 * /api/v1/segments:
 *   post:
 *     summary: Create a segment
 *     tags: [Segments]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerSegment'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerSegment'
 *       400:
 *         description: Validation error
 */
r.post("/", createSegment);

/**
 * @swagger
 * /api/v1/segments/{id}:
 *   get:
 *     summary: Get a segment by id
 *     tags: [Segments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Segment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerSegment'
 *       404:
 *         description: Not found
 */
r.get("/:id", getSegment);

/**
 * @swagger
 * /api/v1/segments/{id}:
 *   patch:
 *     summary: Update a segment
 *     tags: [Segments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerSegment'
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
r.patch("/:id", updateSegment);

/**
 * @swagger
 * /api/v1/segments/{id}:
 *   delete:
 *     summary: Delete a segment
 *     tags: [Segments]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
r.delete("/:id", deleteSegment);

export default r;
