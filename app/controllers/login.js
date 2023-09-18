const express = require('express');
const authService = require('../models/login');

const app = express.Router();
app.use(express.json());

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
