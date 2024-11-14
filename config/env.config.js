const path = require("path")
const fs = require("fs")
require("dotenv").config()

var dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
}

module.exports = {
    dbConfig: dbConfig,
}
