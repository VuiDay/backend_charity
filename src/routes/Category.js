const { Router } = require('express')
const Category = Router()
const categorys = require('../controllers/Category')
const { uploadCategory } = require('../modules/Upload')

Category.get('/getcategory', categorys.getCategory)
Category.post('/createcategory', uploadCategory.single('Image'), categorys.createCategory)
Category.get('/getCategoryid/:id', categorys.getCategoryID)

module.exports = Category