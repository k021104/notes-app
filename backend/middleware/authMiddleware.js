const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  try {
    //Get token from header
    const authHeader = req.headers.authorization

    //Check token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided'
      })
    }

    //Remove bearer from token
    const token = authHeader.split(' ')[1]

    //verify token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)

    //Store decoded user data in request
    req.user = decoded

    //Move to next function
    next()
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token'
    })
  }
}

module.exports = { verifyToken }
