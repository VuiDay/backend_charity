const express = require('express')
const posts = require('../controllers/Post')
const { verifyToken } = require('../middlewares/verifyToken')
const { uploadPost } = require('../modules/Upload')
const { Router } = require('express')
const Post = Router()

Post.post('/creaetPost', verifyToken, uploadPost.array('image'), posts.creaetPost)
Post.get('/getPost/:id', posts.getPost)

module.exports = Post

