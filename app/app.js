const express = require('express');
const login = require('./controllers/login'); // Import the login controller
const forgetpass = require('./controllers/resetPassword') //Import the reset password controller
const verifyToken = require('./middleware/tokenauth'); // Import the verifyToken middleware
const fileProcessor = require('./controllers/fileProcessor'); // Import the fileProcessor controller
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');
const { document_approval } = require('./taskScheduler/document_approval');
const cron = require('node-cron');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Add the auth routes
app.use('/api', forgetpass);
app.use('/api', login);
cron.schedule('54 15 * * *', async () => {

    document_approval();
})

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



module.exports = app