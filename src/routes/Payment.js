const { Router } = require('express')
const Payment = Router()
const payments = require('../controllers/Payment')

Payment.get('/payment_get_list', payments.PaymentList)
Payment.post('/payment_create', payments.PaymentCreate)

module.exports = Payment