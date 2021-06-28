const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    owner: mongoose.Types.ObjectId,
    token: String
})

const Token = mongoose.model('token', tokenSchema)

module.exports = Token