const express = require('express')
const users = require('../controllers/User')
const { verifyToken, verifyTokenEmail, verifyRegister } = require('../middlewares/verifyToken')
const { uploadAvatar } = require('../modules/Upload')
const { Router } = require('express')
const userHandle = Router()

userHandle.post('/register', verifyRegister, uploadAvatar.single('avatar'), users.RegisterApp);
userHandle.post('/login', users.LoginApp);
userHandle.post('/verify-email', users.verifYEmail);
userHandle.post('/verify-code', verifyTokenEmail, users.verifyCode);
userHandle.get('/user-get', verifyToken, users.getUser);
userHandle.get('/user-getID', users.getUserByID);
userHandle.post('/changestatus', users.changeStatus);
userHandle.get('/user-get-list', users.getListUser);
userHandle.put('/update-avatar', verifyToken, uploadAvatar.single('avatar'), users.changeAvatar)
userHandle.put('/update-password', verifyToken, users.changePw)
userHandle.put('/update-username', verifyToken, users.changeInforUser)

module.exports = userHandle;