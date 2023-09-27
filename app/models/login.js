const jwt = require('jsonwebtoken');
const pool = require('../config/postgres.config');
require('dotenv').config();
const bcrypt = require('bcrypt');

const secretKey = process.env.SECRET_KEY;

async function login(username, password) {
    try {
        // Query the database to find a user with the given username
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (rows.length === 0) {
            // No user with the given username found
            return { error: 'Invalid username or password.' };
        }

        const user = rows[0];

        // Compare the password from the request with the hashed password from the database
        if (password === user.password) {
            // Passwords match, generate a JWT token
            const token = jwt.sign({ username }, secretKey, { expiresIn: '12h' });
            return { message: 'You have logged in successfully.', token };

        } else {
            return { error: 'Invalid username or password.' };
        }
    } catch (error) {
        console.error("Error in login function:", error);
        return { error: 'Internal Server Error' };
    }
}



module.exports = { login };
