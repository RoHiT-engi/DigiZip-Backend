// const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    let token
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1]
        bytes  = CryptoJS.AES.decrypt(sessionStorage.getItem('user'), process.env.SECRETKEY);
        decoded = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        req.user = await User.findOne(decoded.email)
  
        next()
      } catch (error) {
        console.error(error)
        res.status(401)
        throw new Error('Not authorized, token failed')
      }
    }
  
    if (!token) {
      res.status(401)
      throw new Error('Not authorized, no token')
    }
  })

module.exports = protect