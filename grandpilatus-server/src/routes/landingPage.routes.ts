import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
    createLandingPage, listLandingPages, getLandingPage, updateLandingPage, deleteLandingPage
} from "../controllers/landingPage.controller";

const r = Router();
// Only logged in users should touch the landing page builder
r.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: LandingPages
 *   description: Manage landing pages (draft/published)
 */

r.get("/", listLandingPages);
/**
 * @swagger
 * /api/v1/landing-pages:
 *   get:
 *     summary: List all landing pages
 *     tags: [LandingPages]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: OK
 */
r.post("/", createLandingPage);
/**
 * @swagger
 * /api/v1/landing-pages:
 *   post:
 *     summary: Create landing page
 *     tags: [LandingPages]
 *     security: [ { bearerAuth: [] } ]
 */

r.get("/:id", getLandingPage);
r.patch("/:id", updateLandingPage);
r.delete("/:id", deleteLandingPage);

export default r;
