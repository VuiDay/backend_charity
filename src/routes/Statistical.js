const express = require('express')
const { Router } = require('express')
const statistical = require('../controllers/Statistical')
const Statistical = Router()

Statistical.get('/general', statistical.generalStistical)
Statistical.get('/finance', statistical.financeStistical)
Statistical.get('/user', statistical.userStistical)

module.exports = Statistical