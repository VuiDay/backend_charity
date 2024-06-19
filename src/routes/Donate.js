const { Router } = require('express')
const Donate = Router()
const donates = require('../controllers/Donate')
const { uploadCharity } = require('../modules/Upload')
const { verifyToken } = require('../middlewares/verifyToken')

// Donate.post('/donate_create', verifyToken, donates.DonateCreate)
Donate.get('/get-donate/:id', donates.getDonate)
Donate.post('/create-payment-link', verifyToken, donates.createPayment)

module.exports = Donate