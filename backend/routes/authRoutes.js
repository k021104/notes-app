const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const { register, login, refreshAccessToken } = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshAccessToken)

module.exports = router
