require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
// Setup your Middleware and API Router here
// Testing codes

module.exports = app;
