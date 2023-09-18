const express = require('express');
const authService = require('../models/resetPassword');

const app = express();
app.use(express.json());

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
