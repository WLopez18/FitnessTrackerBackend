require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors());
app.use(express.json());
// Setup your Middleware and API Router here
// Testing codes
const apiRouter = require('./api');
app.use('/api', apiRouter);

module.exports = app;
