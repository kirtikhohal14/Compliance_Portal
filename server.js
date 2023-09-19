const http = require("http");
require('dotenv').config();
const app = require("./app/app");
const port = process.env.PORT

// Creating HTTP Server
const server = http.createServer(app);
// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
