const express = require('express');
const login = require('./controllers/login'); // Import the login controller
const forgetpass = require('./controllers/resetPassword') //Import the reset password controller
const verifyToken = require('./middleware/tokenauth'); // Import the verifyToken middleware
const fileProcessor = require('./controllers/fileProcessor'); // Import the fileProcessor controller
const certification = require('./controllers/certification');
const regulation = require('./controllers/regulation')
const meaPlugs = require('./controllers/mea_plugs')
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Add the auth routes
app.use('/api', forgetpass);
app.use('/api', login);

// Apply the verifyToken middleware to all routes after this point
app.use(function (req, res, next) {
    verifyToken(req.headers['x-access-token'], req, function (err, result) {
        if (err) {
            console.log("error", err);
            res.status(result.code).json({ error: result.msg });
        } else {
            if (result.code === 401) {
                res.status(result.code).json({ data: result.msg });
            } else {
                next();
            }
        }
    });
});

// Define your other routes here, which will now require the valid x-access-token
app.use('/api', fileProcessor);
app.use('/api', certification);
app.use('/api', regulation)
app.use('/api',meaPlugs);




module.exports = app