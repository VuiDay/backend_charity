const express = require('express')
const comments = require('../controllers/Comment')
const { verifyToken } = require('../middlewares/verifyToken')
const { uploadComment } = require('../modules/Upload')
const { Router } = require('express')
const Comment = Router()

Comment.post('/comment-create', verifyToken, uploadComment.array('image'), comments.createComment)
Comment.get('/comment-get/:id', comments.getComment)

module.exports = Comment