const express = require('express')
const questions = require('../controllers/Question')
const { Router } = require('express')
const Question = Router()

Question.post('/question-create', questions.createQuestion)
Question.get('/question-get', questions.getQuestion)

module.exports = Question