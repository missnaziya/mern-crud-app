const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const mysecret = 'myultrasecretcode'

const getHashPassword = (password)=>{
    return bcrypt.hash(password, 10)
}

const getToken = (payload)=>{
    const token = jwt.sign(payload, mysecret);
    return token
}

module.exports = { 
    getHashPassword,
    getToken
 }