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
 *     summary: Sign in a user
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       '200':
 *         description: A successful response with the user's details and a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *       '400':
 *         description: Invalid request body or missing email/password fields
 *         content:
 *           application/json:
 *             example:
 *               message: Missing email or password
 *       '401':
 *         description: Failed login attempts exceeded for the email address
 *         content:
 *           application/json:
 *             example:
 *               message: Too many login attempts
 *       '404':
 *         description: User with specified email address not found
 *         content:
 *           application/json:
 *             example:
 *               message: User doesn't exist
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
router.post("/signin", signin);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
 
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - _id
 *         - email
 *         - name
 *         - password
 */
router.post("/signup", signup);

module.exports = router;