const pool = require('../config/postgres.config');
const transporter = require('./fileProcessor').transporter
const { storeInRedisCache, getValueFromCache } = require('./helper')
const bcrypt = require('bcrypt');

async function sendOTP(email) {
    try {
        // Generate a random 6-digit OTP
        let otp = Math.floor(Math.random() * 900000) + 100000;
        console.log(otp)

        // Check if the provided email exists in the "users" table
        const { rowCount } = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

        if (rowCount === 0) {
           // return { error: 'Email not found in the database.' };
           return { error: 'The Email ID you have entered is not a registerd Email ID' };
        }
        // Calculate OTP expiration time (5 minutes from now)
        const otpExpiration = 5 * 60; // 5 minutes in seconds
        const storeTokenResult = await storeInRedisCache(email, otp, otpExpiration)
        console.log(storeTokenResult)

        // Send the OTP to the provided email address using Nodemailer
        await transporter.sendMail({
            from: 'khohalkirti@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        });

        return { message: 'OTP sent successfully to your registered Email ID.', otp };
    } catch (error) {
        console.error("Error in sendOTP function:", error);
        return { error: 'Internal Server Error' };
    }
}
;

async function verifyOTP(email, enteredOTP) {
    try {
        // Fetch the stored OTP and its expiration time from Redis
        const storedOTP = await getValueFromCache(email);

        if (!storedOTP) {
            return { error: 'The OTP has expired. Please request a new OTP.' };
        }

        // Check if the entered OTP matches the stored OTP
        if (enteredOTP !== storedOTP) {
            return { error: 'Invalid OTP.' };
        }

        // If all checks pass, return success
        return { message: 'OTP verification successful.' };
    } catch (error) {
        console.error("Error in verifyOTP function:", error);
        return { error: 'Internal Server Error' };
    }
}


async function resetPassword(email, newPassword) {
    try {
        // Check if the provided email exists in the "users" table
        const { rowCount, rows } = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

        if (rowCount === 0) {
            return { error: 'Email not found in the database.' };
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // You can adjust the salt rounds as needed

        // Update the password for the user with the provided email
        await pool.query('UPDATE Users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        return { message: 'Password reset successfully.' };
    } catch (error) {
        console.error("Error in resetPassword function:", error);
        return { error: 'Internal Server Error' };
    }
}



module.exports = { sendOTP, verifyOTP, resetPassword };
