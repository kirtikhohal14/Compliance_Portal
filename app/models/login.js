const jwt = require('jsonwebtoken');
const pool = require('../config/postgres.config');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const base64 = require("base-64");

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
        const pass = base64.decode(password);
        console.log(pass);

        return new Promise((resolve, reject) => {
            bcrypt.compare(pass, user.password, (err, result) => {
                if (err) {
                    console.log("Error: ", err);
                    reject({ error: 'Invalid username or password.' });
                } else if (result) {
                    // Passwords match, generate a JWT token
                    console.log("Result: ", result);
                    const token = jwt.sign({ username }, secretKey, { expiresIn: '12h' });
                    resolve({ message: 'You have logged in successfully.', token });
                } else {
                    reject({ error: 'Invalid username or password.' });
                }
            });
        });




    } catch (error) {
        console.error("Error in login function:", error);
        return { error: 'Internal Server Error' };
    }
}



module.exports = { login };
