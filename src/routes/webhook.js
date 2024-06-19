const express = require("express")
const Donate = require("../models/Donate")
const Charity = require("../models/Charity")
const User = require("../models/User")
const webhookRouter = express.Router()
const donates = require('../controllers/Donate')

webhookRouter.all("/payos", donates.AuthenDonate)
module.exports = webhookRouter