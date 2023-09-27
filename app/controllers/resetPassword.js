const express = require('express');
const authService = require('../models/resetPassword');

const app = express();
app.use(express.json());

/**
 * @swagger
 * tags:
 *   name: Password Reset
 *   description: API endpoints for password reset
 */

/**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: Send OTP for password reset
 *     description: Send a One-Time Password (OTP) to the provided email address for password reset.
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to send the OTP.
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request or invalid email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const response = await authService.sendOTP(email);

        if (response.error) {
            res.status(400).json({ error: response.error });
        } else {
            res.status(200).json({ message: response.message });
        }
    } catch (error) {
        console.error("Error in /send-otp route:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     description: Verify the One-Time Password (OTP) provided by the user for password reset.
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address associated with the OTP.
 *               otp:
 *                 type: string
 *                 description: The OTP to be verified.
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * */

// Verify OTP endpoint
app.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const response = await authService.verifyOTP(email, otp);

        if (response.error) {
            res.status(400).json({ error: response.error });
        } else {
            res.status(200).json({ message: response.message });
        }
    } catch (error) {
        console.error("Error in /verify-otp route:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Reset the user's password using a new password.
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address associated with the user account.
 *               newPassword:
 *                 type: string
 *                 description: The new password to set for the user.
 *     responses:
 *       '200':
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * */

// Reset password endpoint 
app.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const response = await authService.resetPassword(email, newPassword);

        if (response.error) {
            res.status(400).json({ error: response.error });
        } else {
            res.status(200).json({ message: response.message });
        }
    } catch (error) {
        console.error("Error in /reset-password route:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = app;
