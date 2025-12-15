const jwt = require('jsonwebtoken')
require('dotenv').config()

function genToken(email){
    return jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:"1h"})
}

function verToken(tokenEmail){
    return jwt.verify(tokenEmail, process.env.JWT_SECRET)
}

module.exports = {genToken, verToken}