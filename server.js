const http = require("http");
const app = require("./app/app");
require('dotenv').config();
const port = process.env.PORT

// Creating HTTP Server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
