const express = require('express');
const authService = require('../models/login');

const app = express.Router();
app.use(express.json());
/**
 * 
@swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the successful login.
 *                 token:
 *                   type: string
 *                   description: An authentication token for the user session.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message indicating the reason for authorization failure.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message indicating an internal server error.
 */


// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await authService.login(username, password);

        if (response.error) {
            res.status(401).json({ error: response.error });
        } else {
            // Return both the message and the token
            res.status(200).json({ message: response.message, token: response.token });
        }
    } catch (error) {
        console.error("Error in /login route:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = app;
