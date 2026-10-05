const express = require('express')
const router = express.Router()
const AuthMiddleware = require('../middleware/authMiddleware')
const {HandleRegistration, HandleLogin, HandleGetUser,HandleLogout} = require("../controller/user")

router.post('/registration',HandleRegistration)
router.post('/login',HandleLogin)
router.get('/me', AuthMiddleware, HandleGetUser)
router.post('/logout',AuthMiddleware,HandleLogout)


module.exports = router