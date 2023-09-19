const http = require("http");
const express = require('express');
require('dotenv').config();
const app = require("./app/app");
const port = process.env.PORT

// Creating HTTP Server
const server = http.createServer(app);
console.log("port", port)
// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
