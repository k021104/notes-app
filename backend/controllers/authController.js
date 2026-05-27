const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//Register API
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    //check existing user
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

//Login API
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    //find user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    //create token
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: '7d'
    // })

    //create access token
    const accesstoken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET, {
      expiresIn: '15m'
    })

    //create refresh token
    const refreshtoken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    res.cookie('refreshToken', refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      success: true,
      accessToken: accesstoken,
      user
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: error.message
    })
  }
}

//Refresh Token API
const refreshAccessToken = (req, res) => {
  try {
    // console.log(req.body)
    //Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken

    //Check token exists
    if (!refreshToken) {
      return res.status(401).json({
        message: 'refresh token required'
      })
    }

    //verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)

    //creates new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_SECRET,
      { expiresIn: '15m' }
    )

    //send new access token
    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    })
  } catch (error) {
    console.log(error)

    res.status(401).json({
      message: 'Invalid refresh token'
    })
  }
}

module.exports = {
  register,
  login,
  refreshAccessToken
}
