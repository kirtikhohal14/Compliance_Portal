const http = require("http");
const express = require('express');
//const app = require("./app/app");
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./app/swaggerConfig');


const port = process.env.PORT
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Creating HTTP Server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
