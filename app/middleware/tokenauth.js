const jwt = require('jsonwebtoken');
const jwtTokenSecret = process.env.SECRET_KEY;

function verifyToken(token, req, callback) {
    if (token) {
        try {
            const decoded = jwt.verify(token, jwtTokenSecret);

            const tokenExpiration = decoded.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();

            if (tokenExpiration <= currentTime) {
                callback(null, { msg: 'Token expired', code: 401 });
            } else {
                callback(null, { msg: 'Authorized', code: 200 });
            }
        } catch (err) {
            callback(null, { msg: 'Unauthorized', code: 401 });
        }
    } else {
        callback(null, { msg: 'Unauthorized', code: 401 });
    }
}

module.exports = verifyToken;
