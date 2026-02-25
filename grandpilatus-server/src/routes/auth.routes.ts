import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const r = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRegisterRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@hotel.test
 *         password:
 *           type: string
 *           example: Admin123!
 *     AuthLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@hotel.test
 *         password:
 *           type: string
 *           example: Admin123!
 *     AuthTokensResponse:
 *       type: object
 *       properties:
 *         access:
 *           type: string
 *           description: JWT access token
 *         refresh:
 *           type: string
 *           description: JWT refresh token
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register admin user (seed/dev only)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       201:
 *         description: Created user (id + email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Validation or duplicate error
 */
r.post("/register", register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login and receive JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokensResponse'
 *       401:
 *         description: Invalid credentials
 */
r.post("/login", login);

export default r;
