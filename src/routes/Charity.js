const { Router } = require('express')
const Charity = Router()
const charitys = require('../controllers/Charity')
const { verifyToken } = require('../middlewares/verifyToken')
const { uploadCharity } = require('../modules/Upload')

Charity.get('/getcharity', charitys.getCharity)
Charity.get('/getcharityid/:id', charitys.getCharityById)
Charity.get('/getcharityIdCategory/:id', charitys.getCharityByIdCategory)
Charity.post('/createcharity', verifyToken, uploadCharity.array('Image'), charitys.createCharity)
Charity.post('/updatecharity', verifyToken, uploadCharity.array('Image'), charitys.updateCharity)
Charity.post('/changestatus', charitys.changeStatus)
Charity.get('/charity-get-count', charitys.countCharity)
Charity.get('/charity-get-user', verifyToken, charitys.getCharityByUser)
Charity.get('/charity-user-donate', verifyToken, charitys.getCharityDonate)

module.exports = Charity