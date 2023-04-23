const express = require('express')
const router = express.Router();

const { signin, signup } = require('../controllers/user.js');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication.
 */

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in a user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: A token for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 */
router.post("/signin", signin);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       200:
 *         description: A token for the new user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 */
router.post("/signup", signup);

module.exports = router;