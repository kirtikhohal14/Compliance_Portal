const Pool = require("pg").Pool;
require('dotenv').config();
const dbuser = process.env.DBUSER
const dbpassword = process.env.DBPASSWORD
const database = process.env.DATABASE

const pool = new Pool({
    user: dbuser,
    host: "localhost",
    database: database,
    password: dbpassword,
    port: 5432,
});

module.exports = pool;