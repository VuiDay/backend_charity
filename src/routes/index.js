const express = require('express')
const router = express.Router()
const userHandle = require('./User.js')
const dataCharity = require('./Charity.js')
const dataCategory = require('./Category.js')
const postUser = require('./Post.js')
const donate = require('./Donate.js')
const payment = require('./Payment.js')
const question = require('./Question.js')
const post = require('./Post.js')
const comment = require('./Comment.js')
const Statistical = require('./Statistical.js')

router.use("/user", userHandle)
router.use("/data", dataCharity)
router.use("/category", dataCategory)
router.use("/post", postUser)
router.use('/donate', donate)
router.use('/payment', payment)
router.use('/question', question)
router.use('/post', post)
router.use('/statistical', Statistical)
router.use('/comment', comment)
router.use("/webhook", require("./webhook.js"))

module.exports = router